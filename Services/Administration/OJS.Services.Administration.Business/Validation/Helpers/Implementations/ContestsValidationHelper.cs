namespace OJS.Services.Administration.Business.Validation.Helpers.Implementations;

using OJS.Services.Common.Models;
using OJS.Data.Models.Contests;
using OJS.Services.Common;
using OJS.Services.Common.Models.Contests;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using OJS.Services.Common.Validation.Helpers;
using OJS.Services.Infrastructure.Extensions;
using System.Threading.Tasks;
using Resource = OJS.Common.Resources.ContestsControllers;

public class ContestsValidationHelper : IContestsValidationHelper
{
    private readonly IContestsBusinessService contestsBusiness;
    private readonly INotDefaultValueValidationHelper notDefaultValueValidationHelper;
    private readonly Business.IUserProviderService userProvider;
    private readonly IContestsActivityService activityService;

    public ContestsValidationHelper(
        IContestsBusinessService contestsBusiness,
        INotDefaultValueValidationHelper notDefaultValueValidationHelper,
        Business.IUserProviderService userProvider,
        IContestsActivityService activityService)
    {
        this.contestsBusiness = contestsBusiness;
        this.notDefaultValueValidationHelper = notDefaultValueValidationHelper;
        this.userProvider = userProvider;
        this.activityService = activityService;
    }

    public async Task<ValidationResult> ValidatePermissionsOfCurrentUser(int? contestId)
    {
        this.notDefaultValueValidationHelper
            .ValidateValueIsNotDefault(contestId, nameof(contestId))
            .VerifyResult();

        var user = this.userProvider.GetCurrentUser();

        return await this.contestsBusiness.UserHasContestPermissions(contestId!.Value, user.Id, user.IsAdmin)
            ? ValidationResult.Valid()
            : ValidationResult.Invalid("You don't not have permissions for this contest");
    }

    public async Task<ValidationResult> ValidateActiveContestCannotEditDurationTypeOnEdit(
        Contest existingContest,
        Contest newContest)
    {
        var isActive = await this.activityService.IsActive(existingContest.Map<ContestForActivityServiceModel>());

        if (isActive &&
            (existingContest.Duration != newContest.Duration ||
             existingContest.Type != newContest.Type))
        {
            return ValidationResult.Invalid(Resource.ActiveContestCannotEditDurationType);
        }

        return ValidationResult.Valid();
    }

    public async Task<ValidationResult> ValidateContestIsNotActive(Contest contest)
    {
        var isActive = await this.activityService.IsActive(contest.Map<ContestForActivityServiceModel>());

        if (isActive)
        {
            return ValidationResult.Invalid(Resource.ActiveContestForbiddenForDeletion);
        }

        return ValidationResult.Valid();
    }
}