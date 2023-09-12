namespace OJS.Services.Administration.Business.Validation.Implementations.ContestCategories;

using OJS.Common;
using Models.Contests.Categories;
using OJS.Services.Common.Validation;
using OJS.Services.Common.Models;

public class ContestCategoriesValidationService : IValidationService<ContestCategoriesValidationServiceModel>
{
    public ValidationResult GetValidationResult(ContestCategoriesValidationServiceModel? contest)
        => contest!.OrderBy < 0
            ? ValidationResult.Invalid(Resources.ContestCategories.ContestCategoryOrderByCanNotBeNegative)
            : ValidationResult.Valid();
}