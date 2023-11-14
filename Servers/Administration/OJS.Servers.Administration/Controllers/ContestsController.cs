namespace OJS.Servers.Administration.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Threading.Tasks;
    using AutoCrudAdmin.Models;
    using AutoCrudAdmin.ViewModels;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Options;
    using OJS.Data.Models;
    using OJS.Data.Models.Contests;
    using OJS.Data.Models.Problems;
    using OJS.Servers.Administration.Models.Contests;
    using OJS.Services.Administration.Business.Extensions;
    using OJS.Services.Administration.Business.Validation.Factories;
    using OJS.Services.Administration.Business.Validation.Helpers;
    using OJS.Services.Administration.Data;
    using OJS.Services.Administration.Models;
    using OJS.Services.Infrastructure.Extensions;
    using AdminResource = OJS.Common.Resources.AdministrationGeneral;
    using Resource = OJS.Common.Resources.ContestsControllers;

    public class ContestsController : BaseAutoCrudAdminController<Contest>
    {
        private readonly IIpsDataService ipsData;
        private readonly IParticipantsDataService participantsData;
        private readonly IValidatorsFactory<Contest> contestValidatorsFactory;
        private readonly IContestCategoriesValidationHelper contestCategoriesValidationHelper;
        private readonly IContestsValidationHelper contestsValidationHelper;

        public ContestsController(
            IIpsDataService ipsData,
            IParticipantsDataService participantsData,
            IValidatorsFactory<Contest> contestValidatorsFactory,
            IContestCategoriesValidationHelper contestCategoriesValidationHelper,
            IContestsValidationHelper contestsValidationHelper,
            IOptions<ApplicationConfig> appConfigOptions)
            : base(appConfigOptions)
        {
            this.ipsData = ipsData;
            this.participantsData = participantsData;
            this.contestValidatorsFactory = contestValidatorsFactory;
            this.contestCategoriesValidationHelper = contestCategoriesValidationHelper;
            this.contestsValidationHelper = contestsValidationHelper;
        }

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
            if (entity.CategoryId.HasValue)
            {
                await this.contestCategoriesValidationHelper
                    .ValidatePermissionsOfCurrentUser(entity.CategoryId.Value)
                    .VerifyResult();
            }

            if (action != EntityAction.Create)
            {
                await this.contestsValidationHelper
                    .ValidatePermissionsOfCurrentUser(entity.Id)
                    .VerifyResult();
            }
        }

        protected override async Task BeforeEntitySaveAsync(Contest entity, AdminActionContext actionContext)
        {
            await base.BeforeEntitySaveAsync(entity, actionContext);

            if (entity.CategoryId.HasValue)
            {
                await this.contestCategoriesValidationHelper
                    .ValidatePermissionsOfCurrentUser(entity.CategoryId.Value)
                    .VerifyResult();
            }

            if (actionContext.Action != EntityAction.Create)
            {
                await this.contestsValidationHelper
                    .ValidatePermissionsOfCurrentUser(entity.Id)
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
            => base.GenerateFormControls(entity, action, entityDict, complexOptionFilters, autocompleteType)
                .Concat(new[]
                {
                    new FormControlViewModel
                    {
                        Name = AdditionalFormFields.AllowedIps.ToString(),
                        Type = typeof(string),
                        Value = string.Join(", ", entity.IpsInContests.Select(x => x.Ip.Value)),
                    },
                });

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