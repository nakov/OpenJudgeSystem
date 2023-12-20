namespace OJS.Services.Ui.Business.Validations.Implementations.Contests;

using OJS.Data.Models.Contests;
using OJS.Services.Common.Models;
using OJS.Services.Common.Models.Users;

public class ContestDetailsValidationService : IContestDetailsValidationService
{
    private readonly IContestCategoriesBusinessService categoriesService;

    public ContestDetailsValidationService(
        IContestCategoriesBusinessService categoriesService) =>
        this.categoriesService = categoriesService;

    public ValidationResult GetValidationResult((Contest?, int?, bool) item)
    {
        var (contest, contestId, isUserAdminOrLecturerInContest) = item;

        if (contest == null ||
            contest.IsDeleted ||
            ((!contest.Category!.IsVisible || !contest.IsVisible ||
              this.categoriesService.IsCategoryChildOfInvisibleParent(contest.Category.Id)) && !isUserAdminOrLecturerInContest))
        {
            return ValidationResult.Invalid(string.Format(ValidationMessages.Contest.NotFound, contestId));
        }

        return ValidationResult.Valid();
    }
}