namespace OJS.Services.Administration.Business.Validation.Helpers.Implementations;

using System.Threading.Tasks;
using OJS.Data.Models.Contests;
using OJS.Services.Common;
using OJS.Services.Common.Models.Contests;
using OJS.Services.Infrastructure.Extensions;
using Resource = OJS.Common.Resources.ContestsControllers;
using OJS.Common.Enumerations;
using OJS.Services.Administration.Models.Contests;
using System;
using OJS.Services.Administration.Business.Contests;
using OJS.Services.Infrastructure.Models;

public class ContestsValidationHelper : IContestsValidationHelper
{
    private readonly IContestsBusinessService contestsBusiness;
    private readonly IUserProviderService userProvider;
    private readonly IContestsActivityService activityService;

    public ContestsValidationHelper(
        IContestsBusinessService contestsBusiness,
        IUserProviderService userProvider,
        IContestsActivityService activityService)
    {
        this.contestsBusiness = contestsBusiness;
        this.userProvider = userProvider;
        this.activityService = activityService;
    }

    public async Task<ValidationResult> ValidatePermissionsOfCurrentUser(int? contestId)
    {
        var user = this.userProvider.GetCurrentUser();

        return GetValidationResult(await this.contestsBusiness.UserHasContestPermissions(
            contestId!.Value,
            user.Id,
            user.IsAdmin));
    }

    public async Task<ValidationResult> ValidateCategoryPermissions(int? categoryId)
    {
        var user = this.userProvider.GetCurrentUser();

        return GetValidationResult(await this.contestsBusiness.UserHasContestPermissions(
            categoryId!.Value,
            user.Id,
            user.IsAdmin));
    }

    // For deletion after new administration is added.
    public async Task<ValidationResult> ValidateActiveContestCannotEditDurationTypeOnEdit(
        Contest existingContest,
        Contest newContest)
    {
        var isActive = await this.activityService.IsContestActive(existingContest.Map<ContestForActivityServiceModel>());

        if (isActive &&
            (existingContest.Duration != newContest.Duration ||
             existingContest.Type != newContest.Type))
        {
            return ValidationResult.Invalid(Resource.ActiveContestCannotEditDurationType);
        }

        return ValidationResult.Valid();
    }

    public async Task<ValidationResult> ValidateActiveContestCannotEditDurationTypeOnEdit(
        Contest existingContest,
        ContestAdministrationModel newContest)
    {
        var isActive = await this.activityService.IsContestActive(existingContest.Map<ContestForActivityServiceModel>());

        var updateContestType = (ContestType)Enum.Parse(typeof(ContestType), newContest.Type!);
        if (isActive &&
            (existingContest.Duration != newContest.Duration ||
             existingContest.Type != updateContestType))
        {
            return ValidationResult.Invalid(Resource.ActiveContestCannotEditDurationType);
        }

        return ValidationResult.Valid();
    }

    public async Task<ValidationResult> ValidateContestIsNotActive(Contest contest)
    {
        var isActive = await this.activityService.IsContestActive(contest.Map<ContestForActivityServiceModel>());

        if (isActive)
        {
            return ValidationResult.Invalid(Resource.ActiveContestForbiddenForDeletion);
        }

        return ValidationResult.Valid();
    }

    private static ValidationResult GetValidationResult(bool isValid)
        => isValid
            ? ValidationResult.Valid()
            : ValidationResult.Invalid("You don't not have permissions for this contest");
}