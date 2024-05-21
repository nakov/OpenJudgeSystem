namespace OJS.Services.Ui.Business.Validations.Implementations.Contests;

using OJS.Data.Models.Contests;
using OJS.Services.Common.Models;
using OJS.Services.Common.Models.Users;
using OJS.Services.Infrastructure;
using OJS.Services.Infrastructure.Models;

public class ContestDetailsValidationService : IContestDetailsValidationService
{
    private readonly IContestCategoriesBusinessService categoriesService;
    private readonly IDatesService dates;

    public ContestDetailsValidationService(
        IContestCategoriesBusinessService categoriesService,
        IDatesService dates)
    {
        this.categoriesService = categoriesService;
        this.dates = dates;
    }

    public ValidationResult GetValidationResult((Contest?, bool) item)
    {
        var (contest, isUserAdminOrLecturerInContest) = item;

        if (contest == null ||
            contest.IsDeleted ||
            ((!contest.Category!.IsVisible || !contest.IsVisible || contest.VisibleFrom > this.dates.GetUtcNow() ||
              this.categoriesService.IsCategoryChildOfInvisibleParentRecursive(contest.CategoryId)) && !isUserAdminOrLecturerInContest))
        {
            return ValidationResult.Invalid(ValidationMessages.Contest.NotFound);
        }

        return ValidationResult.Valid();
    }
}