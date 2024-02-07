namespace OJS.Services.Administration.Business.ContestCategories.Validators;

using FluentValidation;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.ContestCategories;
using OJS.Services.Common.Validation;

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
            .GreaterThan(model => 0)
            .WithMessage("Order By cannot be negative number");

        this.RuleFor(model => model)
            .Must((model, cancellation)
                => this.ValidateParentCategoryIsValid(model))
            .WithMessage($"Provided Parent category does not exist.");
    }

    private bool ValidateParentCategoryIsValid(ContestCategoryAdministrationModel model)
    {
        // If ParentId = 0 and Parent is empty > no parent category has been selected
        if (model.ParentId == 0 && string.IsNullOrEmpty(model.Parent))
        {
            return true;
        }

        var contestCategory = this.categoriesDataService.GetByIdWithParent(model.ParentId)
            .GetAwaiter()
            .GetResult();

        if (contestCategory is null)
        {
            return false;
        }

        return true;
    }
}