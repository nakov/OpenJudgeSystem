namespace OJS.Servers.Administration.Controllers
{
    using AutoCrudAdmin.Controllers;
    using AutoCrudAdmin.ViewModels;
    using OJS.Data.Models;
    using OJS.Data.Models.Contests;
    using OJS.Data.Models.Problems;
    using OJS.Servers.Infrastructure.Extensions;
    using OJS.Services.Administration.Data;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using AdminResource = OJS.Common.Resources.AdministrationGeneral;
    using Resource = OJS.Common.Resources.ContestsControllers;

    public class ContestsController : AutoCrudAdminController<Contest>
    {
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

        protected override IEnumerable<Func<Contest, EntityAction, Task<ValidatorResult>>> AsyncEntityValidators
            => new Func<Contest, EntityAction, Task<ValidatorResult>>[]
            {
                this.ValidateContestCategoryPermissions,
                this.ValidateContest,
            };

        protected override async Task BeforeEntitySaveOnCreateAsync(
            Contest contest,
            IDictionary<string, string> entityDict)
        {
            this.AddProblemGroupsToContest(contest, contest.NumberOfProblemGroups);
            await this.AddIpsToContest(contest, entityDict["AllowedIps"]);
        }

        protected override async Task BeforeEntitySaveOnEditAsync(
            Contest contest,
            IDictionary<string, string> entityDict)
        {
            if (contest.IsOnline && contest.ProblemGroups.Count == 0)
            {
                this.AddProblemGroupsToContest(contest, contest.NumberOfProblemGroups);
            }

            if (!contest.IsOnline && contest.Duration != null)
            {
                contest.Duration = null;
            }

            contest.IpsInContests.Clear();
            await this.AddIpsToContest(contest, entityDict["AllowedIps"]);
        }

        protected override async Task AfterEntitySaveOnEditAsync(
            Contest contest,
            IDictionary<string, string> entityDict)
        {
            // TODO: Fix logic. Original values before the edit are not passed here.
            var originalContestPassword = entityDict[nameof(contest.ContestPassword)];
            var originalPracticePassword = entityDict[nameof(contest.PracticePassword)];

            await this.InvalidateParticipants(originalContestPassword, originalPracticePassword, contest);
        }

        protected override IEnumerable<FormControlViewModel> GenerateFormControls(Contest entity, EntityAction action)
            => base.GenerateFormControls(entity, action)
                .Concat(new []
                {
                    new FormControlViewModel
                    {
                        Name = "AllowedIps",
                        Type = typeof(string),
                        Value = default,
                    },
                });

        private async Task<ValidatorResult> ValidateContestCategoryPermissions(Contest contest, EntityAction action)
        {
            var userId = this.User.GetId();
            var userIsAdmin = this.User.IsAdmin();

            if (contest.CategoryId.HasValue &&
                await this.contestCategoriesData.UserHasContestCategoryPermissions(
                    contest.CategoryId.Value,
                    userId,
                    userIsAdmin))
            {
                return ValidatorResult.Success();
            }

            return ValidatorResult.Error(AdminResource.No_privileges_message);
        }

        private async Task<ValidatorResult> ValidateContest(Contest model, EntityAction action)
        {
            if (model.StartTime >= model.EndTime)
            {
                return ValidatorResult.Error(Resource.Contest_start_date_before_end);
            }

            if (model.PracticeStartTime >= model.PracticeEndTime)
            {
                return ValidatorResult.Error(Resource.Practice_start_date_before_end);
            }

            if (model.IsOnline)
            {
                if (!model.Duration.HasValue)
                {
                    return ValidatorResult.Error(Resource.Required_field_for_online);
                }

                if (model.Duration.Value.TotalHours >= 24)
                {
                    return ValidatorResult.Error(Resource.Duration_invalid_format);
                }

                if (model.NumberOfProblemGroups <= 0)
                {
                    return ValidatorResult.Error(Resource.Required_field_for_online);
                }

                if (model.NumberOfProblemGroups > ProblemGroupsCountLimit)
                {
                    return ValidatorResult.Error(
                        string.Format(Resource.Problem_groups_count_limit, ProblemGroupsCountLimit));
                }
            }

            if (action == EntityAction.Edit)
            {
                return await this.ValidateContestOnEdit(model);
            }

            return ValidatorResult.Success();
        }

        private async Task<ValidatorResult> ValidateContestOnEdit(Contest model)
        {
            var contest = await this.contestsData.OneById(model.Id);

            if (contest == null)
            {
                return ValidatorResult.Error(Resource.Contest_not_found);
            }

            if (contest.IsOnline &&
                contest.IsActive &&
                (contest.Duration != model.Duration || contest.Type != model.Type))
            {
                return ValidatorResult.Error(Resource.Active_contest_cannot_edit_duration_type);
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