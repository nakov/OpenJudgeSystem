namespace OJS.Services.Administration.Business.ProblemResources.Validators;

using FluentValidation;

using OJS.Common.Enumerations;
using OJS.Data.Models.Problems;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.ProblemResources;
using OJS.Services.Common.Validation;

public class ProblemResourceAdministrationModelValidator : BaseAdministrationModelValidator<ProblemResourceAdministrationModel, int, ProblemResource>
{
    public ProblemResourceAdministrationModelValidator(IProblemResourcesDataService problemResourcesDataService)
        : base(problemResourcesDataService)
    {
        this.RuleFor(model => model.Name)
            .NotNull()
            .NotEmpty()
            .WithMessage("The resource's name is mandatory.")
            .When(x => x is { OperationType: CrudOperationType.Create or CrudOperationType.Update });

        this.RuleFor(model => model.ProblemId)
            .GreaterThanOrEqualTo(0)
            .WithMessage("The Problem Id cannot be less than 0.")
            .When(x => x is { OperationType: CrudOperationType.Create or CrudOperationType.Update });

        this.RuleFor(model => model)
            .Must(NotContainBothLinkAndFile)
            .WithMessage("The resource cannot contain both links and files.")
            .When(x => x is { OperationType: CrudOperationType.Create or CrudOperationType.Update });

        this.RuleFor(model => model)
            .Must(ContainEitherLinkOrFile)
            .WithMessage("The resource should contain either a file or a link.")
            .When(x => x is { OperationType: CrudOperationType.Create or CrudOperationType.Update });
    }

    private static bool NotContainBothLinkAndFile(ProblemResourceAdministrationModel model)
    {
        if (model.File != null && !string.IsNullOrEmpty(model.Link))
        {
            return false;
        }

        return true;
    }

    private static bool ContainEitherLinkOrFile(ProblemResourceAdministrationModel model)
        => !string.IsNullOrEmpty(model.Link) || model.File is { Length: > 0 };
}