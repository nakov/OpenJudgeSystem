namespace OJS.Services.Administration.Business.Validation.Factories.Implementations;

using AutoCrudAdmin.Models;
using AutoCrudAdmin.ViewModels;
using OJS.Data.Models.Contests;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AdminResource = OJS.Common.Resources.AdministrationGeneral;
using Resource = OJS.Common.Resources.ContestsControllers;

public class ContestValidatorsFactory : IContestValidatorsFactory
{
    private const int ProblemGroupsCountLimit = 40;

    public IEnumerable<Func<Contest, Contest, AdminActionContext, ValidatorResult>> GetValidators()
        => new Func<Contest, Contest, AdminActionContext, ValidatorResult>[]
        {
            ValidateContestStartTime,
            ValidateContestPracticeStartTime,
            ValidateOnlineContestDuration,
            ValidateOnlineContestProblemGroups,
            ValidateActiveContestCannotEditDurationTypeOnEdit,
            ValidateContestIsNotActiveOnDelete,
        };

    public IEnumerable<Func<Contest, Contest, AdminActionContext, Task<ValidatorResult>>> GetAsyncValidators()
        => Enumerable.Empty<Func<Contest, Contest, AdminActionContext, Task<ValidatorResult>>>();

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

        private static ValidatorResult ValidateContestIsNotActiveOnDelete(Contest contest, Contest _, AdminActionContext actionContext)
        {
            if (actionContext.Action != EntityAction.Delete)
            {
                return ValidatorResult.Success();
            }

            if (contest.IsActive)
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