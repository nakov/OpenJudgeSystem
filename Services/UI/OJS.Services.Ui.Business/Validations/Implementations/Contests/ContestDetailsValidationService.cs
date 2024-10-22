namespace OJS.Services.Ui.Business.Validations.Implementations.Contests;

using System.Threading.Tasks;
using OJS.Services.Ui.Models.Contests;
using OJS.Services.Infrastructure;
using OJS.Services.Infrastructure.Models;
using OJS.Services.Ui.Business.Cache;

public class ContestDetailsValidationService : IContestDetailsValidationService
{
    private readonly IContestCategoriesCacheService categoriesCacheService;
    private readonly IDatesService dates;

    public ContestDetailsValidationService(
        IDatesService dates,
        IContestCategoriesCacheService categoriesCacheService)
    {
        this.dates = dates;
        this.categoriesCacheService = categoriesCacheService;
    }

    public async Task<ValidationResult> GetValidationResult((ContestDetailsServiceModel?, bool) item)
    {
        var (contest, isUserAdminOrLecturerInContest) = item;

        var contestIsVisible = contest?.IsVisible == true || contest?.VisibleFrom <= this.dates.GetUtcNow();

        if (contest == null ||
            contest.IsDeleted ||
            ((contest.Category == null || !contest.Category!.IsVisible || contest.Category!.IsDeleted ||
              !contestIsVisible ||
              await this.categoriesCacheService.IsCategoryChildOfInvisibleParentRecursive(contest.CategoryId)) && !isUserAdminOrLecturerInContest))
        {
            return ValidationResult.Invalid(ValidationMessages.Contest.NotFound);
        }

        return ValidationResult.Valid();
    }
}