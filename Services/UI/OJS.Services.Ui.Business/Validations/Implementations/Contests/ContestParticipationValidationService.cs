namespace OJS.Services.Ui.Business.Validations.Implementations.Contests;

using OJS.Data.Models.Contests;
using OJS.Services.Common;
using OJS.Services.Common.Models;
using OJS.Services.Common.Models.Contests;
using OJS.Services.Common.Models.Users;
using OJS.Services.Infrastructure;
using OJS.Services.Ui.Data;
using OJS.Services.Infrastructure.Extensions;
using OJS.Services.Infrastructure.Models;

public class ContestParticipationValidationService : IContestParticipationValidationService
{
    private readonly IDatesService datesService;
    private readonly IContestsActivityService activityService;
    private readonly IContestCategoriesBusinessService categoriesService;
    private readonly ILecturersInContestsBusinessService lecturersInContestsBusiness;
    private readonly IContestsDataService contestsData;

    public ContestParticipationValidationService(
        IDatesService datesService,
        IContestsActivityService activityService,
        IContestCategoriesBusinessService categoriesService,
        ILecturersInContestsBusinessService lecturersInContestsBusiness,
        IContestsDataService contestsData)
    {
        this.datesService = datesService;
        this.activityService = activityService;
        this.categoriesService = categoriesService;
        this.lecturersInContestsBusiness = lecturersInContestsBusiness;
        this.contestsData = contestsData;
    }

    public ValidationResult GetValidationResult((Contest?, int?, UserInfoModel?, bool) item)
    {
        var (contest, contestId, user, official) = item;

        // TODO: Fix so it uses lecturers in contests business service
        var userIsAdminOrLecturerInContest = user != null && (user.IsAdmin || this.lecturersInContestsBusiness
            .IsCurrentUserAdminOrLecturerInContest(contest?.Id)
            .GetAwaiter()
            .GetResult());

        var contestIsVisible = contest?.IsVisible == true || contest?.VisibleFrom <= this.datesService.GetUtcNow();

        if (contest == null ||
            user == null ||
            contest.IsDeleted ||
            ((!contestIsVisible || !contest.Category!.IsVisible || this.categoriesService.IsCategoryChildOfInvisibleParentRecursive(contest.CategoryId)) &&
            !userIsAdminOrLecturerInContest))
        {
            return ValidationResult.Invalid(ValidationMessages.Contest.NotFound);
        }

        if (userIsAdminOrLecturerInContest)
        {
            return ValidationResult.Valid();
        }

        var contestActivityEntity = this.activityService.GetContestActivity(contest.Map<ContestForActivityServiceModel>())
            .GetAwaiter()
            .GetResult();

        if (official && !contestActivityEntity.CanBeCompeted)
        {
            return ValidationResult.Invalid(ValidationMessages.Contest.CanBeCompeted);
        }

        if (!official && !contestActivityEntity.CanBePracticed)
        {
            return ValidationResult.Invalid(ValidationMessages.Contest.CanBePracticed);
        }

        if (contest.IsOnlineExam &&
            official &&
            !userIsAdminOrLecturerInContest &&
            !this.contestsData.IsUserInExamGroupByContestAndUser(contest.Id, user.Id).GetAwaiter().GetResult())
        {
            return ValidationResult.Invalid(ValidationMessages.Participant.NotRegisteredForExam);
        }

        return ValidationResult.Valid();
    }
}