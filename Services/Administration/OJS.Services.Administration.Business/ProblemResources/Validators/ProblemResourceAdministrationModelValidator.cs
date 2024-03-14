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
            .NotEmpty()
            .WithMessage("Resource name is mandatory");

        this.RuleFor(model => model.Id)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Id cannot be less than 0.");

        this.RuleFor(model => model.ProblemId)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Problem Id cannot be less than 0.");

        this.RuleFor(model => model)
            .Must(NotContainBothLinkAndFile)
            .WithMessage("Resource cannot contain both links and files.");
    }

    private static bool NotContainBothLinkAndFile(ProblemResourceAdministrationModel model)
    {
        if (model.File != null && !string.IsNullOrEmpty(model.Link))
        {
            return false;
        }

        return true;
    }
}