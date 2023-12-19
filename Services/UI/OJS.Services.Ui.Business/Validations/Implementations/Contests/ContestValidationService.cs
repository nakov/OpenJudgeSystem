namespace OJS.Services.Ui.Business.Validations.Implementations.Contests;

using System.Linq;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using OJS.Data.Models.Contests;
using OJS.Services.Common.Models.Contests;
using OJS.Services.Ui.Data;
using OJS.Services.Common;
using OJS.Services.Common.Models;
using OJS.Services.Common.Models.Users;
using Infrastructure;

public class ContestValidationService : IContestValidationService
{
    private readonly IDatesService datesService;
    private readonly IContestsActivityService activityService;
    private readonly IContestCategoriesDataService categoriesDataService;

    public ContestValidationService(
        IDatesService datesService,
        IContestsActivityService activityService,
        IContestCategoriesDataService categoriesDataService)
    {
        this.datesService = datesService;
        this.activityService = activityService;
        this.categoriesDataService = categoriesDataService;
    }

    public ValidationResult GetValidationResult((Contest?, int?, UserInfoModel?, bool) item)
    {
        var (contest, contestId, user, official) = item;

        var isUserLecturerInContest = contest != null && user != null && user.IsLecturer;

        var isCategoryChildOfInvisibleParent = this.IsCategoryChildOfInvisibleParent(contestId);

        if (contest == null ||
            user == null ||
            contest.IsDeleted ||
            ((!contest.IsVisible || !contest.Category!.IsVisible || isCategoryChildOfInvisibleParent) &&
            !isUserLecturerInContest &&
            !user.IsAdmin))
        {
            return ValidationResult.Invalid(string.Format(ValidationMessages.Contest.NotFound, contestId));
        }

        if (user.IsAdmin || isUserLecturerInContest)
        {
            return ValidationResult.Valid();
        }

        var contestActivityEntity = this.activityService
            .GetContestActivity(contest.Map<ContestForActivityServiceModel>());

        if (official && !contestActivityEntity.CanBeCompeted)
        {
            return ValidationResult.Invalid(string.Format(ValidationMessages.Contest.CanBeCompeted, contest.Name));
        }

        if (!official && !contestActivityEntity.CanBePracticed)
        {
            return ValidationResult.Invalid(string.Format(ValidationMessages.Contest.CanBePracticed, contest.Name));
        }

        return ValidationResult.Valid();
    }

    private bool IsCategoryChildOfInvisibleParent(int? contestId) =>
        this.categoriesDataService.GetAllInvisible()
            .Any(c => c.Children
                .Any(cc => cc.Id == contestId));
}