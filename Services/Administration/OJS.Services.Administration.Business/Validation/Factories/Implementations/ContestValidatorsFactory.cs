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

public class ContestValidatorsFactory : IValidatorsFactory<Contest>
{
    private const int ProblemGroupsCountLimit = 40;

    public IEnumerable<Func<Contest, Contest, AdminActionContext, ValidatorResult>> GetValidators()
        => new Func<Contest, Contest, AdminActionContext, ValidatorResult>[]
        {
            ValidateContestStartTime, ValidateContestPracticeStartTime,
            ValidateOnlineContestDuration, ValidateOnlineContestDuration,
            ValidateCategoryIsSet,
        };

    public IEnumerable<Func<Contest, Contest, AdminActionContext, Task<ValidatorResult>>> GetAsyncValidators()
        => Enumerable.Empty<Func<Contest, Contest, AdminActionContext, Task<ValidatorResult>>>();

    private static ValidatorResult ValidateContestStartTime(Contest oldContest, Contest newContest, AdminActionContext adminActionContext)
        => newContest.StartTime >= newContest.EndTime
            ? ValidatorResult.Error(Resource.ContestStartDateBeforeEnd)
            : ValidatorResult.Success();

    private static ValidatorResult ValidateContestPracticeStartTime(Contest oldContest, Contest newContest, AdminActionContext adminActionContext)
        => newContest.PracticeStartTime >= newContest.PracticeEndTime
            ? ValidatorResult.Error(Resource.PracticeStartDateBeforeEnd)
            : ValidatorResult.Success();

    private static ValidatorResult ValidateOnlineContestDuration(Contest oldContest, Contest newContest, AdminActionContext adminActionContext)
    {
        if (newContest.IsOnlineExam)
        {
            if (!newContest.Duration.HasValue)
            {
                return ValidatorResult.Error(string.Format(Resource.RequiredFieldForOnline));
            }

            if (newContest.Duration.Value.TotalHours >= 24)
            {
                return ValidatorResult.Error(Resource.DurationInvalidFormat);
            }
        }

        return ValidatorResult.Success();
    }

    private static ValidatorResult ValidateOnlineContestProblemGroups(Contest oldContest, Contest newContest, AdminActionContext adminActionContext)
    {
        if (newContest.IsOnlineExam)
        {
            if (newContest.NumberOfProblemGroups <= 0)
            {
                return ValidatorResult.Error(string.Format(Resource.RequiredFieldForOnline));
            }

            if (newContest.NumberOfProblemGroups > ProblemGroupsCountLimit)
            {
                return ValidatorResult.Error(
                    string.Format(Resource.ProblemGroupsCountLimit, ProblemGroupsCountLimit));
            }
        }

        return ValidatorResult.Success();
    }

    private static ValidatorResult ValidateCategoryIsSet(Contest oldContest, Contest newContest, AdminActionContext adminActionContext) =>
        newContest.CategoryId.HasValue && newContest.CategoryId == default(int)
            ? ValidatorResult.Error(Resource.CategoryNotSelected)
            : ValidatorResult.Success();
}