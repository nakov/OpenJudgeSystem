namespace OJS.Services.Administration.Business.Checkers.Validators;

using FluentValidation;
using OJS.Data.Validation;
using OJS.Services.Administration.Models.Checkers;
using OJS.Services.Common.Validation;

public class CheckerAdministrationModelValidator : BaseValidator<CheckerAdministrationModel>
{
    public CheckerAdministrationModelValidator()
    {
        this.RuleFor(model => model.Id)
            .NotNull()
            .GreaterThanOrEqualTo(0);

        this.RuleFor(model => model.Name)
            .NotNull()
            .NotEmpty()
            .MinimumLength(ConstraintConstants.Checker.NameMinLength)
            .MaximumLength(ConstraintConstants.Checker.NameMaxLength);
    }
}