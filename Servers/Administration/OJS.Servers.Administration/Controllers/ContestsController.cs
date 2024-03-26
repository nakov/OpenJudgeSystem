namespace OJS.Servers.Administration.Controllers
{
    using AutoCrudAdmin.Extensions;
    using AutoCrudAdmin.Models;
    using AutoCrudAdmin.ViewModels;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Options;
    using OJS.Common.Extensions;
    using OJS.Data.Models;
    using OJS.Data.Models.Contests;
    using OJS.Data.Models.Problems;
    using OJS.Services.Administration.Business;
    using OJS.Services.Administration.Business.Extensions;
    using OJS.Services.Administration.Business.Validation.Factories;
    using OJS.Services.Administration.Business.Validation.Helpers;
    using OJS.Services.Administration.Data;
    using OJS.Services.Administration.Models;
    using OJS.Services.Administration.Models.Contests;
    using OJS.Services.Administration.Models.Submissions;
    using OJS.Services.Common.Validation.Helpers;
    using OJS.Services.Infrastructure.Extensions;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Threading.Tasks;
    using AdminResource = OJS.Common.Resources.AdministrationGeneral;
    using Resource = OJS.Common.Resources.ContestsControllers;

    public class ContestsController : BaseAutoCrudAdminController<Contest>
    {
        private const string ContestCategoryName = nameof(Contest.Category);

        private readonly IIpsDataService ipsData;
        private readonly IParticipantsDataService participantsData;
        private readonly ILecturerContestPrivilegesBusinessService lecturerContestPrivilegesBusinessService;
        private readonly IValidatorsFactory<Contest> contestValidatorsFactory;
        private readonly IContestCategoriesValidationHelper categoriesValidationHelper;
        private readonly IContestsValidationHelper contestsValidationHelper;
        private readonly IProblemGroupsDataService problemGroupsData;
        private readonly IContestsDataService contestsDataService;
        private readonly IIpsDataService ipsDataService;
        private readonly INotDefaultValueValidationHelper notDefaultValueValidationHelper;

        public ContestsController(
            IIpsDataService ipsData,
            IParticipantsDataService participantsData,
            ILecturerContestPrivilegesBusinessService lecturerContestPrivilegesBusinessService,
            IValidatorsFactory<Contest> contestValidatorsFactory,
            IContestCategoriesValidationHelper categoriesValidationHelper,
            INotDefaultValueValidationHelper notDefaultValueValidationHelper,
            IOptions<ApplicationConfig> appConfigOptions,
            IContestsValidationHelper contestsValidationHelper,
            IProblemGroupsDataService problemGroupsData,
            IContestsDataService contestsDataService,
            IIpsDataService ipsDataService)
            : base(appConfigOptions)
        {
            this.ipsData = ipsData;
            this.participantsData = participantsData;
            this.lecturerContestPrivilegesBusinessService = lecturerContestPrivilegesBusinessService;
            this.contestValidatorsFactory = contestValidatorsFactory;
            this.contestsValidationHelper = contestsValidationHelper;
            this.categoriesValidationHelper = categoriesValidationHelper;
            this.notDefaultValueValidationHelper = notDefaultValueValidationHelper;
            this.problemGroupsData = problemGroupsData;
            this.contestsDataService = contestsDataService;
            this.ipsDataService = ipsDataService;
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

            if (oldContest != null && oldContest!.CategoryId != entity.CategoryId)
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
            newContest.ProblemGroups = this.problemGroupsData
                .GetAllByContest(newContest.Id)
                .ToList();

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

            var ipsInContests = this.GetContestIps(existingContest.Id);

            if (ipsInContests.Any())
            {
                await this.ipsDataService.DeleteIps(ipsInContests);
            }

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

            var ipsInContests = this.GetContestIps(entity.Id);

            if (ipsInContests.Any())
            {
                entity.IpsInContests = ipsInContests.ToList();
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

        protected override Expression<Func<Contest, bool>>? GetMasterGridFilter()
        {
            var filterExpressions = new List<Expression<Func<Contest, bool>>>();

            var filterByLecturerRightsExpression = this.lecturerContestPrivilegesBusinessService.GetContestUserPrivilegesExpression(
                this.User.GetId(),
                this.User.IsAdmin());

            filterExpressions.Add(filterByLecturerRightsExpression);

            if (this.TryGetEntityIdForStringColumnFilter(ContestCategoryName, out var categoryName))
            {
                filterExpressions.Add(c => c.Category != null && c.Category.Name == categoryName);
            }

            return filterExpressions.CombineMultiple();
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

        private IEnumerable<IpInContest> GetContestIps(int id)
            => this.contestsDataService
                .GetContestWithIps(id)
                .SelectMany(c => c.IpsInContests);

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
    }
}