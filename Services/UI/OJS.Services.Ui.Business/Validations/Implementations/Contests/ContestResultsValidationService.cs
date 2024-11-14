namespace OJS.Services.Ui.Business.Validations.Implementations.Contests;

using OJS.Services.Common;
using OJS.Services.Common.Models.Contests;
using OJS.Services.Common.Validation.Helpers;
using OJS.Services.Infrastructure;
using OJS.Services.Infrastructure.Extensions;
using OJS.Services.Infrastructure.Models;
using OJS.Services.Ui.Data;
using OJS.Services.Ui.Models.Contests;

public class ContestResultsValidationService : IContestResultsValidationService
{
    private readonly INotDefaultValueValidationHelper notDefaultValueValidationHelper;
    private readonly ILecturersInContestsBusinessService lecturersInContestsBusiness;
    private readonly IContestsActivityService activityService;
    private readonly IParticipantsDataService participantsData;
    private readonly IDatesService datesService;
    private readonly IUserProviderService userProvider;

    public ContestResultsValidationService(
        INotDefaultValueValidationHelper notDefaultValueValidationHelper,
        ILecturersInContestsBusinessService lecturersInContestsBusiness,
        IContestsActivityService activityService,
        IParticipantsDataService participantsData,
        IDatesService datesService,
        IUserProviderService userProvider)
    {
        this.notDefaultValueValidationHelper = notDefaultValueValidationHelper;
        this.lecturersInContestsBusiness = lecturersInContestsBusiness;
        this.activityService = activityService;
        this.participantsData = participantsData;
        this.datesService = datesService;
        this.userProvider = userProvider;
    }

    public ValidationResult GetValidationResult((ContestDetailsServiceModel?, bool, bool) item)
    {
        var (contest, fullResults, isOfficial) = item;

        var contestNullValidationResult = this.notDefaultValueValidationHelper.ValidateValueIsNotDefault(contest, nameof(contest));

        if (!contestNullValidationResult.IsValid)
        {
            return contestNullValidationResult;
        }

        var user = this.userProvider.GetCurrentUser();

        var isUserAdminOrLecturer = user != null && (user.IsAdmin || this.lecturersInContestsBusiness
            .IsCurrentUserAdminOrLecturerInContest(contest?.Id)
            .GetAwaiter()
            .GetResult());

        if (fullResults && !user!.IsAdminOrLecturer)
        {
            return ValidationResult.Invalid(ValidationMessages.Participant.NoPrivilegesForContestResults);
        }

        if (isUserAdminOrLecturer)
        {
            return ValidationResult.Valid();
        }

        var contestIsVisible = contest?.IsVisible == true || contest?.VisibleFrom <= this.datesService.GetUtcNow();

        if (!contestIsVisible || contest!.IsDeleted)
        {
            return ValidationResult.Invalid(ValidationMessages.Participant.ResultsNotVisibleForContest);
        }

        var contestActivity = this.activityService.GetContestActivity(contest!.Map<ContestForActivityServiceModel>())
            .GetAwaiter()
            .GetResult();

        var contestHasStartDateAndEndTimeIsBeforeNow =
            contest.StartTime.HasValue &&
            contest.EndTime.HasValue &&
            contest.EndTime <= this.datesService.GetUtcNow();

        if (isOfficial && (!contestHasStartDateAndEndTimeIsBeforeNow && this.participantsData
                .GetByContestByUserAndByIsOfficial(contest.Id, user!.Id, isOfficial)
                .GetAwaiter()
                .GetResult() == null))
        {
            return ValidationResult.Invalid(ValidationMessages.Participant.ResultsNotVisibleForContest);
        }

        if (!isOfficial && (!contestActivity.CanBePracticed && !contestActivity.CanBeCompeted))
        {
            return ValidationResult.Invalid(ValidationMessages.Participant.ResultsNotVisibleForContest);
        }

        return ValidationResult.Valid();
    }
}