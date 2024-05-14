namespace OJS.Services.Administration.Business.Validation.Implementations.ContestCategories;

using OJS.Services.Administration.Models.Contests.Categories;
using OJS.Services.Common.Validation;
using OJS.Services.Common.Models;
using OJS.Services.Infrastructure;
using OJS.Services.Infrastructure.Models;
using GlobalResource = OJS.Common.Resources.ContestCategoriesController;

public class ContestCategoriesValidationService : IValidationService<ContestCategoriesValidationServiceModel>
{
    public ValidationResult GetValidationResult(ContestCategoriesValidationServiceModel? model)
    {
        if (model!.OrderBy < 0)
        {
            return ValidationResult.Invalid(GlobalResource.ContestCategoryOrderByCanNotBeNegative);
        }

        if (string.IsNullOrEmpty(model.Name))
        {
            return ValidationResult.Invalid(GlobalResource.RequiredName);
        }

        return ValidationResult.Valid();
    }
}