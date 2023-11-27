namespace OJS.Servers.Administration.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Text.Json;
    using System.Threading.Tasks;
    using AutoCrudAdmin.Models;
    using AutoCrudAdmin.ViewModels;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Options;
    using OJS.Common.Contracts;
    using OJS.Common.Extensions;
    using OJS.Data.Models;
    using OJS.Data.Models.Contests;
    using OJS.Data.Models.Problems;
    using OJS.Data.Models.Submissions;
    using OJS.Servers.Administration.Extensions;
    using OJS.Servers.Administration.Models;
    using OJS.Servers.Administration.Models.Contests;
    using OJS.Services.Administration.Business;
    using OJS.Services.Administration.Business.Extensions;
    using OJS.Services.Administration.Business.Validation.Factories;
    using OJS.Services.Administration.Business.Validation.Helpers;
    using OJS.Services.Administration.Data;
    using OJS.Services.Administration.Models;
    using OJS.Services.Administration.Models.Contests.Submissions;
    using OJS.Services.Common.Validation.Helpers;
    using OJS.Services.Infrastructure.Extensions;
    using OJS.Services.Infrastructure.HttpClients;
    using OJS.Workers.Common.Extensions;
    using OJS.Workers.Common.Models;
    using OJS.Workers.Tools;
    using AdminResource = OJS.Common.Resources.AdministrationGeneral;
    using Resource = OJS.Common.Resources.ContestsControllers;

    public class ContestsController : BaseAutoCrudAdminController<Contest>
    {
        private readonly IIpsDataService ipsData;
        private readonly IParticipantsDataService participantsData;
        private readonly ILecturerContestPrivilegesBusinessService lecturerContestPrivilegesBusinessService;
        private readonly IContestsDataService contestsDataService;
        private readonly IValidatorsFactory<Contest> contestValidatorsFactory;
        private readonly IContestCategoriesValidationHelper categoriesValidationHelper;
        private readonly IContestsValidationHelper contestsValidationHelper;
        private readonly INotDefaultValueValidationHelper notDefaultValueValidationHelper;
        private readonly IContestsBusinessService contestsBusinessService;
        private readonly ISubmissionsDataService submissionsDataService;
        private readonly IHttpClientService httpClientService;

        public ContestsController(
            IIpsDataService ipsData,
            IParticipantsDataService participantsData,
            ILecturerContestPrivilegesBusinessService lecturerContestPrivilegesBusinessService,
            IValidatorsFactory<Contest> contestValidatorsFactory,
            IContestsValidationHelper contestsValidationHelper,
            IContestCategoriesValidationHelper categoriesValidationHelper,
            INotDefaultValueValidationHelper notDefaultValueValidationHelper,
            IContestsDataService contestsDataService,
            IOptions<ApplicationConfig> appConfigOptions,
            IContestsBusinessService contestsBusinessService,
            ISubmissionsDataService submissionsDataService,
            IHttpClientService httpClientService)
            : base(appConfigOptions)
        {
            this.ipsData = ipsData;
            this.participantsData = participantsData;
            this.lecturerContestPrivilegesBusinessService = lecturerContestPrivilegesBusinessService;
            this.contestValidatorsFactory = contestValidatorsFactory;
            this.contestsValidationHelper = contestsValidationHelper;
            this.categoriesValidationHelper = categoriesValidationHelper;
            this.notDefaultValueValidationHelper = notDefaultValueValidationHelper;
            this.contestsDataService = contestsDataService;
            this.contestsBusinessService = contestsBusinessService;
            this.submissionsDataService = submissionsDataService;
            this.httpClientService = httpClientService;
        }

        protected override Expression<Func<Contest, bool>>? MasterGridFilter
            => this.GetMasterGridFilter();

        protected override IEnumerable<Func<Contest, Contest, AdminActionContext, ValidatorResult>> EntityValidators
            => this.contestValidatorsFactory.GetValidators();

        protected override IEnumerable<Func<Contest, Contest, AdminActionContext, Task<ValidatorResult>>>
            AsyncEntityValidators
            => this.contestValidatorsFactory.GetAsyncValidators();

        protected override IEnumerable<GridAction> CustomActions
            => new[]
            {
                new GridAction { Action = nameof(this.DownloadSubmissions) },
                new GridAction { Action = nameof(this.ExportResults) },
                new GridAction { Action = nameof(this.Problems) },
                new GridAction { Action = nameof(this.CreateProblem) },
                new GridAction { Action = nameof(this.Participants) },
                new GridAction { Action = nameof(this.Submissions) },
            };

        // TODO: make it as a popup window
        [HttpGet]
        public IActionResult DownloadSubmissions([FromQuery] IDictionary<string, string> complexId)
        {
            var model = new DownloadSubmissionsModel
            {
                ContestId = this.GetEntityIdFromQuery<int>(complexId),
            };

            return this.View(model);
        }

        [HttpGet]
        public async Task<IActionResult> GetSubmissionsSimilarityAvailableContests([FromQuery]string? term)
        {
            var availableContests = await this.contestsBusinessService
                .GetAllAvailableForCurrentUser<BySubmissionSimilarityServiceModel>(term);

            return this.Json(availableContests);
        }

        [HttpGet]
        public IActionResult BySubmissionSimilarity()
        {
            var model = new SubmissionSimilarityInputModel();
            return this.View(model);
        }

        [HttpPost]
        public async Task<ActionResult> RenderSubmissionsSimilaritiesGrid(int[] contestIds, PlagiarismDetectorType plagiarismDetectorType)
        {
            var participantsSimilarSubmissionGroups =
                this.GetSimilarSubmissions(contestIds, plagiarismDetectorType)
                    .Select(s => new
                    {
                        s.Id,
                        s.ProblemId,
                        s.ParticipantId,
                        s.Points,
                        s.Content,
                        s.CreatedOn,
                        ParticipantName = s.Participant!.User.UserName,
                        ProblemName = s.Problem.Name,
                        TestRuns = s.TestRuns.OrderBy(t => t.TestId).Select(t => new { t.TestId, t.ResultType }),
                    })
                    .GroupBy(s => new { s.ProblemId, s.ParticipantId })
                    .Select(g => g.OrderByDescending(s => s.Points).ThenByDescending(s => s.CreatedOn).FirstOrDefault())
                    .GroupBy(s => new { s!.ProblemId, s.Points })
                    .ToList();

            var plagiarismDetectorByteArray = await this.httpClientService.Get($"http://localhost:8003/Submissions/GetPlagiarismDetector/{plagiarismDetectorType}");
            IPlagiarismDetector plagiarismDetector;
            using (MemoryStream stream = new MemoryStream(plagiarismDetectorByteArray))
            {
                plagiarismDetector = (await JsonSerializer.DeserializeAsync<IPlagiarismDetector>(stream)) !;
            }

            /*var plagiarismDetector = this.GetPlagiarismDetector(plagiarismDetectorType);*/

            var similarities = new List<SubmissionSimilarityViewModel>();

            for (var index = 0; index < participantsSimilarSubmissionGroups.Count; index++)
            {
                var groupOfSubmissions = participantsSimilarSubmissionGroups[index].ToList();
                for (var i = 0; i < groupOfSubmissions.Count; i++)
                {
                    for (var j = i + 1; j < groupOfSubmissions.Count; j++)
                    {
                        var result = plagiarismDetector.DetectPlagiarism(
                            groupOfSubmissions[i]!.Content.Decompress(),
                            groupOfSubmissions[j]!.Content.Decompress(),
                            new List<IDetectPlagiarismVisitor> { new SortAndTrimLinesVisitor() });

                        var save = true;

                        var firstTestRuns = groupOfSubmissions[i]!.TestRuns.ToList();
                        var secondTestRuns = groupOfSubmissions[j]!.TestRuns.ToList();

                        if (firstTestRuns.Count < secondTestRuns.Count)
                        {
                            secondTestRuns = secondTestRuns
                                .Where(x => firstTestRuns.Any(y => y.TestId == x.TestId))
                                .OrderBy(x => x.TestId)
                                .ToList();
                        }
                        else if (firstTestRuns.Count > secondTestRuns.Count)
                        {
                            firstTestRuns = firstTestRuns
                                .Where(x => secondTestRuns.Any(y => y.TestId == x.TestId))
                                .OrderBy(x => x.TestId)
                                .ToList();
                        }

                        for (var k = 0; k < firstTestRuns.Count; k++)
                        {
                            if (firstTestRuns[k].ResultType != secondTestRuns[k].ResultType)
                            {
                                save = false;
                                break;
                            }
                        }

                        if (save && result.SimilarityPercentage != 0)
                        {
                            similarities.Add(new SubmissionSimilarityViewModel
                            {
                                ProblemName = groupOfSubmissions[i]?.ProblemName,
                                Points = groupOfSubmissions[i]?.Points,
                                Differences = result.Differences?.Count,
                                Percentage = result.SimilarityPercentage,
                                FirstSubmissionId = groupOfSubmissions[i]?.Id,
                                FirstParticipantName = groupOfSubmissions[i]?.ParticipantName,
                                FirstSubmissionCreatedOn = groupOfSubmissions[i]?.CreatedOn,
                                SecondSubmissionId = groupOfSubmissions[j]?.Id,
                                SecondParticipantName = groupOfSubmissions[j]?.ParticipantName,
                                SecondSubmissionCreatedOn = groupOfSubmissions[j]?.CreatedOn,
                            });
                        }
                    }
                }
            }

            return this.PartialView("_SubmissionsGrid", similarities.GroupBy(g => g.ProblemName));
        }

        [HttpGet]
        public IActionResult ExportResults([FromQuery] IDictionary<string, string> complexId)
        {
            var model = new ContestResultsExportRequestModel
            {
                Id = this.GetEntityIdFromQuery<int>(complexId),
            };

            return this.View(model);
        }

        [HttpGet]
        public IActionResult CreateProblem([FromQuery] IDictionary<string, string> complexId)
            => this.RedirectToAction("Create", "Problems", new { ContestId = complexId.Values.First() });

        public IActionResult Participants([FromQuery] IDictionary<string, string> complexId)
            => this.RedirectToActionWithNumberFilter(
                nameof(ParticipantsController),
                ParticipantsController.ContestIdKey,
                this.GetEntityIdFromQuery<int>(complexId));

        public IActionResult Submissions([FromQuery] IDictionary<string, string> complexId)
            => this.RedirectToActionWithNumberFilter(
                nameof(SubmissionsController),
                SubmissionsController.ContestIdKey,
                this.GetEntityIdFromQuery<int>(complexId));

        public IActionResult Problems([FromQuery] IDictionary<string, string> complexId)
            => this.RedirectToActionWithNumberFilter(
                nameof(ProblemsController),
                ProblemsController.ContestIdKey,
                this.GetEntityIdFromQuery<int>(complexId));

        protected override async Task BeforeGeneratingForm(
            Contest entity,
            EntityAction action,
            IDictionary<string, string> entityDict)
        {
            if (action == EntityAction.Create)
            {
                return;
            }

            await this.contestsValidationHelper
                .ValidatePermissionsOfCurrentUser(entity.Id)
                .VerifyResult();
        }

        protected override async Task BeforeEntitySaveAsync(Contest entity, AdminActionContext actionContext)
        {
            await base.BeforeEntitySaveAsync(entity, actionContext);

            if (actionContext.Action != EntityAction.Create)
            {
                await this.contestsValidationHelper
                    .ValidatePermissionsOfCurrentUser(entity.Id)
                    .VerifyResult();
            }

            this.notDefaultValueValidationHelper
                .ValidateValueIsNotDefault(entity.CategoryId, nameof(entity.CategoryId))
                .VerifyResult();

            var oldContest = await this.contestsDataService
                .OneById(entity.Id);

            if (oldContest!.CategoryId != entity.CategoryId)
            {
                // If a lecturer tries to update the category of a contest
                // he should be able to do it only for categories he has lecturer rights for.
                // Otherwise if the category is not changed, even though the lecturer does not have rights for it,
                // no error should be thrown.
                await this.categoriesValidationHelper
                    .ValidatePermissionsOfCurrentUser(entity.CategoryId)
                    .VerifyResult();
            }

            if (!entity.IsOnlineExam && entity.Duration != null)
            {
                entity.Duration = null;
            }
        }

        protected override async Task BeforeEntitySaveOnCreateAsync(
            Contest contest,
            AdminActionContext actionContext)
        {
            AddProblemGroupsToContest(contest, contest.NumberOfProblemGroups);
            await this.AddIpsToContest(contest, actionContext.GetFormValue(AdditionalFormFields.AllowedIps));
        }

        protected override async Task BeforeEntitySaveOnEditAsync(
            Contest existingContest,
            Contest newContest,
            AdminActionContext actionContext)
        {
            await this.contestsValidationHelper.ValidateActiveContestCannotEditDurationTypeOnEdit(
                existingContest, newContest).VerifyResult();

            if (newContest.IsOnlineExam && newContest.ProblemGroups.Count == 0)
            {
                AddProblemGroupsToContest(newContest, newContest.NumberOfProblemGroups);
            }

            if (!newContest.IsOnlineExam && newContest.Duration != null)
            {
                newContest.Duration = null;
            }

            newContest.IpsInContests.Clear();
            await this.AddIpsToContest(newContest, actionContext.GetFormValue(AdditionalFormFields.AllowedIps));
        }

        protected override async Task AfterEntitySaveOnEditAsync(
            Contest oldContest,
            Contest contest,
            AdminActionContext actionContext)
        {
            var originalContestPassword = oldContest.ContestPassword;
            var originalPracticePassword = oldContest.PracticePassword;

            await this.InvalidateParticipants(originalContestPassword, originalPracticePassword, contest);
        }

        protected override async Task BeforeEntitySaveOnDeleteAsync(
            Contest existingContest, AdminActionContext actionContext)
            => await this.contestsValidationHelper.ValidateContestIsNotActive(existingContest).VerifyResult();

        protected override IEnumerable<FormControlViewModel> GenerateFormControls(
            Contest entity,
            EntityAction action,
            IDictionary<string, string> entityDict,
            IDictionary<string, Expression<Func<object, bool>>> complexOptionFilters,
            Type autocompleteType)
        {
            var userIsLecturerOnly = !this.User.IsAdmin() && this.User.IsLecturer();

            if (userIsLecturerOnly)
            {
                // Lecturers should be able to create contests only for allowed categories
                complexOptionFilters.Add(
                    new KeyValuePair<string, Expression<Func<object, bool>>>(
                        nameof(entity.Category),
                        category => ((ContestCategory)category)
                            .LecturersInContestCategories
                            .Any(lg => lg.LecturerId == this.User.GetId()) ||
                        ((ContestCategory)category)
                        .Contests
                        .Any(cc => !cc.IsDeleted && cc.LecturersInContests.Any(l => l.LecturerId == this.User.GetId()))));
            }

            return base.GenerateFormControls(entity, action, entityDict, complexOptionFilters, autocompleteType)
                .Concat(new[]
                {
                    new FormControlViewModel
                    {
                        Name = AdditionalFormFields.AllowedIps.ToString(),
                        Type = typeof(string),
                        Value = string.Join(", ", entity.IpsInContests.Select(x => x.Ip.Value)),
                    },
                });
        }

        private static void AddProblemGroupsToContest(Contest contest, int problemGroupsCount)
        {
            for (var i = 1; i <= problemGroupsCount; i++)
            {
                contest.ProblemGroups.Add(new ProblemGroup
                {
                    OrderBy = i,
                });
            }
        }

        private async Task AddIpsToContest(Contest contest, string? mergedIps)
        {
            if (!string.IsNullOrWhiteSpace(mergedIps))
            {
                var ipValues = mergedIps.Split(new[] { ',', ' ' }, StringSplitOptions.RemoveEmptyEntries);
                foreach (var ipValue in ipValues)
                {
                    var ip = await this.ipsData.GetByValue(ipValue) ?? new Ip { Value = ipValue };

                    contest.IpsInContests.Add(new IpInContest { Ip = ip, IsOriginallyAllowed = true });
                }
            }
        }

        private IQueryable<Submission> GetSimilarSubmissions(
            IEnumerable<int> contestIds,
            PlagiarismDetectorType plagiarismDetectorType)
        {
            var orExpressionContestIds = ExpressionExtensions.BuildOrExpression<Submission, int>(
                contestIds,
                s => s.Participant!.ContestId);

            var plagiarismDetectorTypeCompatibleCompilerTypes = plagiarismDetectorType.GetCompatibleCompilerTypes();
            var orExpressionCompilerTypes = ExpressionExtensions.BuildOrExpression<Submission, CompilerType>(
                plagiarismDetectorTypeCompatibleCompilerTypes,
                s => s.SubmissionType!.CompilerType);

            var result = this.submissionsDataService
                .GetAll()
                .Where(orExpressionContestIds)
                .Where(orExpressionCompilerTypes)
                .Where(s => s.Participant!.IsOfficial && s.Points >= 20);

            return result;
        }

        private async Task InvalidateParticipants(
            string? originalContestPassword,
            string? originalPracticePassword,
            Contest contest)
        {
            if (originalContestPassword != contest.ContestPassword &&
                !string.IsNullOrWhiteSpace(contest.ContestPassword))
            {
                await this.participantsData.InvalidateByContestAndIsOfficial(contest.Id, isOfficial: true);
            }

            if (originalPracticePassword != contest.PracticePassword &&
                !string.IsNullOrWhiteSpace(contest.PracticePassword))
            {
                await this.participantsData.InvalidateByContestAndIsOfficial(contest.Id, isOfficial: false);
            }
        }

        private Expression<Func<Contest, bool>>? GetMasterGridFilter()
            => this.lecturerContestPrivilegesBusinessService.GetContestUserPrivilegesExpression(
                this.User.GetId(),
                this.User.IsAdmin());
    }
}