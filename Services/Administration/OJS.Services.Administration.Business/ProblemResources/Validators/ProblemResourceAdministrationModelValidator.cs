namespace OJS.Services.Administration.Business.ProblemResources.Validators;

using OJS.Services.Administration.Models.ProblemResources;
using OJS.Services.Common.Validation;
using FluentValidation;

public class ProblemResourceAdministrationModelValidator : BaseValidator<ProblemResourceAdministrationModel>
{
    public ProblemResourceAdministrationModelValidator()
    {
        this.RuleFor(model => model.Name)
            .NotNull()
            .NotEmpty();

        this.RuleFor(model => model.Id)
            .GreaterThanOrEqualTo(0);

        this.RuleFor(model => model.ProblemId)
            .GreaterThanOrEqualTo(0);
    }
}