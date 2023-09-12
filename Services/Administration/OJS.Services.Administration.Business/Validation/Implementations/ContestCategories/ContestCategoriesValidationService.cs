namespace OJS.Services.Administration.Business.Validation.Implementations.ContestCategories;

using OJS.Common;
using Models.Contests.Categories;
using OJS.Services.Common.Validation;
using OJS.Services.Common.Models;

public class ContestCategoriesValidationService : IValidationService<ContestCategoriesValidationServiceModel>
{
    public ValidationResult GetValidationResult(ContestCategoriesValidationServiceModel? model)
    {
        if (model!.OrderBy < 0)
        {
            return ValidationResult.Invalid(Resources.ContestCategories.ContestCategoryOrderByCanNotBeNegative);
        }

        if (string.IsNullOrEmpty(model.Name))
        {
            return ValidationResult.Invalid(Resources.ContestCategories.ContestCategoryNameCannotBeNull);
        }

        return ValidationResult.Valid();
    }
}