namespace OJS.Servers.Administration.Controllers
{
    using AutoCrudAdmin.Controllers;
    using AutoCrudAdmin.ViewModels;
    using Microsoft.AspNetCore.Mvc;
    using OJS.Data.Models;
    using OJS.Data.Models.Contests;
    using OJS.Data.Models.Problems;
    using OJS.Servers.Administration.Models.Contests;
    using OJS.Servers.Infrastructure.Extensions;
    using OJS.Services.Administration.Data;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Threading.Tasks;
    using AdminResource = OJS.Common.Resources.AdministrationGeneral;
    using Resource = OJS.Common.Resources.ContestsControllers;

    public class ContestsController : AutoCrudAdminController<Contest>
    {
        private enum AdditionalFields
        {
            AllowedIps,
        }

        private const int ProblemGroupsCountLimit = 40;

        private readonly IContestsDataService contestsData;
        private readonly IContestCategoriesDataService contestCategoriesData;
        private readonly IIpsDataService ipsData;
        private readonly IParticipantsDataService participantsData;

        public ContestsController(
            IContestsDataService contestsData,
            IContestCategoriesDataService contestCategoriesData,
            IIpsDataService ipsData,
            IParticipantsDataService participantsData)
        {
            this.contestsData = contestsData;
            this.contestCategoriesData = contestCategoriesData;
            this.ipsData = ipsData;
            this.participantsData = participantsData;
        }

        // TODO: make it as a popup window
        [HttpGet]
        public IActionResult DownloadSubmissions([FromQuery] IDictionary<string, string> complexId)
        {
            var model = new DownloadSubmissionsModel
            {
                ContestId = int.Parse(complexId.Values.First()),
            };

            return this.View(model);
        }

        [HttpGet]
        public IActionResult ExportResults([FromQuery] IDictionary<string, string> complexId)
        {
            var model = new ContestResultsExportRequestModel
            {
                Id = int.Parse(complexId.Values.First()),
            };

            return this.View(model);
        }

        protected override IEnumerable<Func<Contest, Contest, EntityAction, Task<ValidatorResult>>> AsyncEntityValidators
            => new Func<Contest, Contest, EntityAction, Task<ValidatorResult>>[]
            {
                this.ValidateContestCategoryPermissions,
                this.ValidateContest,
            };

        protected override async Task BeforeEntitySaveOnCreateAsync(
            Contest contest,
            IDictionary<string, string> entityDict)
        {
            this.AddProblemGroupsToContest(contest, contest.NumberOfProblemGroups);
            await this.AddIpsToContest(contest, entityDict[AdditionalFields.AllowedIps.ToString()]);
        }

        protected override IEnumerable<GridAction> CustomActions
            => new []
            {
                new GridAction { Action = nameof(this.DownloadSubmissions) },
                new GridAction { Action = nameof(this.ExportResults) },
            };

        protected override async Task BeforeEntitySaveOnEditAsync(
            Contest existingContest,
            Contest newContest,
            IDictionary<string, string> entityDict)
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
            await this.AddIpsToContest(newContest, entityDict[AdditionalFields.AllowedIps.ToString()]);
        }

        protected override async Task AfterEntitySaveOnEditAsync(
            Contest oldContest,
            Contest contest,
            IDictionary<string, string> entityDict)
        {
            var originalContestPassword = oldContest.ContestPassword;
            var originalPracticePassword = oldContest.PracticePassword;

            await this.InvalidateParticipants(originalContestPassword, originalPracticePassword, contest);
        }

        protected override IEnumerable<FormControlViewModel> GenerateFormControls(
            Contest entity,
            EntityAction action,
            IDictionary<string, Expression<Func<object, bool>>> complexOptionFilters)
            => base.GenerateFormControls(entity, action, complexOptionFilters)
                .Concat(new []
                {
                    new FormControlViewModel
                    {
                        Name = AdditionalFields.AllowedIps.ToString(),
                        Type = typeof(string),
                        Value = string.Join(", ", entity.IpsInContests.Select(x => x.Ip.Value)),
                    },
                });

        private async Task<ValidatorResult> ValidateContestCategoryPermissions(
            Contest existingContest,
            Contest newContest,
            EntityAction action)
        {
            var userId = this.User.GetId();
            var userIsAdmin = this.User.IsAdmin();

            if (newContest.CategoryId.HasValue &&
                await this.contestCategoriesData.UserHasContestCategoryPermissions(
                    newContest.CategoryId.Value,
                    userId,
                    userIsAdmin))
            {
                return ValidatorResult.Success();
            }

            return ValidatorResult.Error(AdminResource.No_privileges_message);
        }

        private async Task<ValidatorResult> ValidateContest(
            Contest existingContest,
            Contest newContest, EntityAction action)
        {
            if (newContest.StartTime >= newContest.EndTime)
            {
                return ValidatorResult.Error(Resource.Contest_start_date_before_end);
            }

            if (newContest.PracticeStartTime >= newContest.PracticeEndTime)
            {
                return ValidatorResult.Error(Resource.Practice_start_date_before_end);
            }

            if (newContest.IsOnline)
            {
                if (!newContest.Duration.HasValue)
                {
                    return ValidatorResult.Error(Resource.Required_field_for_online);
                }

                if (newContest.Duration.Value.TotalHours >= 24)
                {
                    return ValidatorResult.Error(Resource.Duration_invalid_format);
                }

                if (newContest.NumberOfProblemGroups <= 0)
                {
                    return ValidatorResult.Error(Resource.Required_field_for_online);
                }

                if (newContest.NumberOfProblemGroups > ProblemGroupsCountLimit)
                {
                    return ValidatorResult.Error(
                        string.Format(Resource.Problem_groups_count_limit, ProblemGroupsCountLimit));
                }
            }

            return action switch
            {
                EntityAction.Edit => this.ValidateContestOnEdit(existingContest, newContest),
                EntityAction.Delete => await this.ValidateContestOnDelete(newContest),
                _ => ValidatorResult.Success(),
            };
        }

        private ValidatorResult ValidateContestOnEdit(Contest existingContest, Contest newContest)
        {
            if (existingContest.IsOnline &&
                existingContest.IsActive &&
                (existingContest.Duration != newContest.Duration || existingContest.Type != newContest.Type))
            {
                return ValidatorResult.Error(Resource.Active_contest_cannot_edit_duration_type);
            }

            return ValidatorResult.Success();
        }

        private async Task<ValidatorResult> ValidateContestOnDelete(Contest contest)
        {
            if (await this.contestsData.IsActiveById(contest.Id))
            {
                return ValidatorResult.Error(Resource.Active_contest_forbidden_for_deletion);
            }

            return ValidatorResult.Success();
        }

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
            string originalContestPassword,
            string originalPracticePassword,
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