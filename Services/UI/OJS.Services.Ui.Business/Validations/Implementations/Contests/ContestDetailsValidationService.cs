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

    public ValidationResult GetValidationResult((Contest?, bool) item)
    {
        var (contest, isUserAdminOrLecturerInContest) = item;

        if (contest == null ||
            contest.IsDeleted ||
            ((!contest.Category!.IsVisible || !contest.IsVisible ||
              this.categoriesService.IsCategoryChildOfInvisibleParentRecursive(contest.CategoryId)) && !isUserAdminOrLecturerInContest))
        {
            return ValidationResult.Invalid(ValidationMessages.Contest.NotFound);
        }

        return ValidationResult.Valid();
    }
}