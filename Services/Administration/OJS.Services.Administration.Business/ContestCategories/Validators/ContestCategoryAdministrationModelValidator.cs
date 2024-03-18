namespace OJS.Services.Administration.Business.ContestCategories.Validators;

using FluentValidation;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.ContestCategories;
using OJS.Services.Common.Validation;
using System.Threading.Tasks;

public class ContestCategoryAdministrationModelValidator : BaseValidator<ContestCategoryAdministrationModel>
{
    private readonly IContestCategoriesDataService categoriesDataService;

    public ContestCategoryAdministrationModelValidator(
        IContestCategoriesDataService categoriesDataService)
    {
        this.categoriesDataService = categoriesDataService;
        this.RuleFor(model => model.Name)
            .NotNull()
            .NotEmpty();

        this.RuleFor(model => model.OrderBy)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Order By cannot be negative number");

        this.RuleFor(model => model)
            .MustAsync(async (model, _)
                => await this.ValidateParentCategoryIsValid(model))
            .WithMessage($"Provided Parent category does not exist.");
    }

    private async Task<bool> ValidateParentCategoryIsValid(ContestCategoryAdministrationModel model)
    {
        // If ParentId = 0 and Parent is empty > no parent category has been selected
        if (model.ParentId is null or 0)
        {
            return true;
        }

        return await this.categoriesDataService.ExistsById(model.ParentId);
    }
}