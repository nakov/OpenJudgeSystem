namespace OJS.Servers.Administration.Controllers
{
    using AutoCrudAdmin.Models;
    using AutoCrudAdmin.ViewModels;
    using Microsoft.AspNetCore.Mvc;
    using OJS.Data.Models;
    using OJS.Data.Models.Contests;
    using OJS.Data.Models.Participants;
    using OJS.Data.Models.Problems;
    using OJS.Servers.Administration.Models.Contests;
    using OJS.Services.Administration.Business.Extensions;
    using OJS.Services.Administration.Business.Validation.Factories;
    using OJS.Services.Administration.Data;
    using OJS.Services.Administration.Models;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Threading.Tasks;
    using AdminResource = OJS.Common.Resources.AdministrationGeneral;
    using Resource = OJS.Common.Resources.ContestsControllers;

    public class ContestsController : BaseAutoCrudAdminController<Contest>
    {
        private readonly IIpsDataService ipsData;
        private readonly IParticipantsDataService participantsData;
        private readonly IContestValidatorsFactory contestValidatorsFactory;

        public ContestsController(
            IIpsDataService ipsData,
            IParticipantsDataService participantsData,
            IContestValidatorsFactory contestValidatorsFactory)
        {
            this.ipsData = ipsData;
            this.participantsData = participantsData;
            this.contestValidatorsFactory = contestValidatorsFactory;
        }

        // TODO: make it as a popup window
        [HttpGet]
        public IActionResult DownloadSubmissions([FromQuery] IDictionary<string, string> complexId)
        {
            var model = new DownloadSubmissionsModel
            {
                ContestId = this.GetEntityIdFromQuery(complexId),
            };

            return this.View(model);
        }

        [HttpGet]
        public IActionResult ExportResults([FromQuery] IDictionary<string, string> complexId)
        {
            var model = new ContestResultsExportRequestModel
            {
                Id = this.GetEntityIdFromQuery(complexId),
            };

            return this.View(model);
        }

        [HttpGet]
        public IActionResult CreateProblem([FromQuery] IDictionary<string, string> complexId)
            => this.RedirectToAction("Create", "Problems", new { ContestId = complexId.Values.First() });

        public IActionResult Participants([FromQuery] IDictionary<string, string> complexId)
            => this.RedirectToActionWithNumberFilter(
                nameof(ParticipantsController),
                nameof(Participant.ContestId),
                this.GetEntityIdFromQuery(complexId));

        public IActionResult Problems([FromQuery] IDictionary<string, string> complexId)
        {
            var contestId = this.GetEntityIdFromQuery(complexId);
            return this.RedirectToAction(
                "Index",
                "Problems",
                new Dictionary<string, string> {  { nameof(contestId), contestId.ToString() } });
        }

        protected override IEnumerable<Func<Contest, Contest, AdminActionContext, ValidatorResult>> EntityValidators
            => this.contestValidatorsFactory.GetValidators();

        protected override IEnumerable<Func<Contest, Contest, AdminActionContext, Task<ValidatorResult>>>
            AsyncEntityValidators
            => this.contestValidatorsFactory.GetAsyncValidators();

        protected override async Task BeforeEntitySaveOnCreateAsync(
            Contest contest,
            AdminActionContext actionContext)
        {
            this.AddProblemGroupsToContest(contest, contest.NumberOfProblemGroups);
            await this.AddIpsToContest(contest, actionContext.GetFormValue(AdditionalFormFields.AllowedIps));
        }

        protected override IEnumerable<GridAction> CustomActions
            => new []
            {
                new GridAction { Action = nameof(this.DownloadSubmissions) },
                new GridAction { Action = nameof(this.ExportResults) },
                new GridAction { Action = nameof(this.Problems) },
                new GridAction { Action = nameof(this.CreateProblem) },
                new GridAction { Action = nameof(this.Participants) },
            };

        protected override async Task BeforeEntitySaveOnEditAsync(
            Contest existingContest,
            Contest newContest,
            AdminActionContext actionContext)
        {
            if (newContest.IsOnline && newContest.ProblemGroups.Count == 0)
            {
                this.AddProblemGroupsToContest(newContest, newContest.NumberOfProblemGroups);
            }

            if (!newContest.IsOnline && newContest.Duration != null)
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

        protected override IEnumerable<FormControlViewModel> GenerateFormControls(
            Contest entity,
            EntityAction action,
            IDictionary<string, string> entityDict,
            IDictionary<string, Expression<Func<object, bool>>> complexOptionFilters)
            => base.GenerateFormControls(entity, action, entityDict, complexOptionFilters)
                .Concat(new []
                {
                    new FormControlViewModel
                    {
                        Name = AdditionalFormFields.AllowedIps.ToString(),
                        Type = typeof(string),
                        Value = string.Join(", ", entity.IpsInContests.Select(x => x.Ip.Value)),
                    },
                });

        private void AddProblemGroupsToContest(Contest contest, int problemGroupsCount)
        {
            for (var i = 1; i <= problemGroupsCount; i++)
            {
                contest.ProblemGroups.Add(new ProblemGroup
                {
                    OrderBy = i,
                });
            }
        }

        private async Task AddIpsToContest(Contest contest, string mergedIps)
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