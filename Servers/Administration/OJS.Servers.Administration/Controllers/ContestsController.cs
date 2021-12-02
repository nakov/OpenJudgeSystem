namespace OJS.Servers.Administration.Controllers
{
    using AutoCrudAdmin.Controllers;
    using AutoCrudAdmin.ViewModels;
    using OJS.Data.Models.Contests;
    using OJS.Servers.Infrastructure.Extensions;
    using OJS.Services.Administration.Data;
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using AdminResource = OJS.Common.Resources.AdministrationGeneral;
    using Resource = OJS.Common.Resources.ContestsControllers;

    public class ContestsController : AutoCrudAdminController<Contest>
    {
        private const int ProblemGroupsCountLimit = 40;

        private readonly IContestsDataService contestsData;
        private readonly IContestCategoriesDataService contestCategoriesData;

        public ContestsController(
            IContestsDataService contestsData,
            IContestCategoriesDataService contestCategoriesData)
        {
            this.contestsData = contestsData;
            this.contestCategoriesData = contestCategoriesData;
        }

        protected override IEnumerable<Func<Contest, EntityAction, Task<ValidatorResult>>> AsyncEntityValidators
            => new Func<Contest, EntityAction, Task<ValidatorResult>>[]
            {
                this.ValidateContestCategoryPermissions,
                this.ValidateContest,
            };

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
    }
}