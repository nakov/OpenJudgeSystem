namespace OJS.Services.Administration.Business.Validation.Factories.Implementations;

using AutoCrudAdmin.Models;
using AutoCrudAdmin.ViewModels;
using OJS.Data.Models.Contests;
using OJS.Services.Administration.Data;
using OJS.Services.Common;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AdminResource = OJS.Common.Resources.AdministrationGeneral;
using Resource = OJS.Common.Resources.ContestsControllers;

public class ContestValidatorsFactory : IContestValidatorsFactory
{
    private const int ProblemGroupsCountLimit = 40;

    private readonly IContestsDataService contestsData;
    private readonly IContestCategoriesDataService contestCategoriesData;
    private readonly IUserProviderService userProvider;

    public ContestValidatorsFactory(
        IContestsDataService contestsData,
        IContestCategoriesDataService contestCategoriesData,
        IUserProviderService userProvider)
    {
        this.contestsData = contestsData;
        this.contestCategoriesData = contestCategoriesData;
        this.userProvider = userProvider;
    }

    public IEnumerable<Func<Contest, Contest, AdminActionContext, ValidatorResult>> GetValidators()
        => new Func<Contest, Contest, AdminActionContext, ValidatorResult>[]
        {
            ValidateContestStartTime,
            ValidateContestPracticeStartTime,
            ValidateOnlineContestDuration,
            ValidateOnlineContestProblemGroups,
            ValidateActiveContestCannotEditDurationTypeOnEdit,
        };

    public IEnumerable<Func<Contest, Contest, AdminActionContext, Task<ValidatorResult>>> GetAsyncValidators()
        => new Func<Contest, Contest, AdminActionContext, Task<ValidatorResult>>[]
        {
            this.ValidateContestCategoryPermissions,
            this.ValidateContestIsNotActiveOnDelete,
        };

    private async Task<ValidatorResult> ValidateContestCategoryPermissions(
            Contest existingContest,
            Contest newContest,
            AdminActionContext actionContext)
    {
        var user = this.userProvider.GetCurrentUser();

        if (newContest.CategoryId.HasValue &&
            await this.contestCategoriesData.UserHasContestCategoryPermissions(
                newContest.CategoryId.Value,
                user.Id,
                user.IsAdmin))
        {
            return ValidatorResult.Success();
        }

        return ValidatorResult.Error(AdminResource.No_privileges_message);
    }

    private static ValidatorResult ValidateActiveContestCannotEditDurationTypeOnEdit(
        Contest existingContest,
        Contest newContest,
        AdminActionContext actionContext)
        {
            if (actionContext.Action != EntityAction.Edit)
            {
                return ValidatorResult.Success();
            }

            if (existingContest.IsOnline &&
                existingContest.IsActive &&
                (existingContest.Duration != newContest.Duration || existingContest.Type != newContest.Type))
            {
                return ValidatorResult.Error(Resource.Active_contest_cannot_edit_duration_type);
            }

            return ValidatorResult.Success();
        }

        private async Task<ValidatorResult> ValidateContestIsNotActiveOnDelete(Contest contest, Contest _, AdminActionContext actionContext)
        {
            if (actionContext.Action != EntityAction.Delete)
            {
                return ValidatorResult.Success();
            }

            if (await this.contestsData.IsActiveById(contest.Id))
            {
                return ValidatorResult.Error(Resource.Active_contest_forbidden_for_deletion);
            }

            return ValidatorResult.Success();
        }

        private static ValidatorResult ValidateContestStartTime(Contest _, Contest newContest, AdminActionContext __)
            => newContest.StartTime >= newContest.EndTime
                ? ValidatorResult.Error(Resource.Contest_start_date_before_end)
                : ValidatorResult.Success();

        private static ValidatorResult ValidateContestPracticeStartTime(Contest _, Contest newContest, AdminActionContext __)
            => newContest.PracticeStartTime >= newContest.PracticeEndTime
                ? ValidatorResult.Error(Resource.Practice_start_date_before_end)
                : ValidatorResult.Success();

        private static ValidatorResult ValidateOnlineContestDuration(Contest _, Contest newContest, AdminActionContext __)
        {
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
            }

            return ValidatorResult.Success();
        }

        private static ValidatorResult ValidateOnlineContestProblemGroups(Contest _, Contest newContest, AdminActionContext __)
        {
            if (newContest.IsOnline)
            {
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

            return ValidatorResult.Success();
        }
}