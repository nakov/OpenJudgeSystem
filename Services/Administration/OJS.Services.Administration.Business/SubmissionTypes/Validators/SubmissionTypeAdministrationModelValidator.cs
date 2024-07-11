namespace OJS.Services.Administration.Business.SubmissionTypes.Validators;

using FluentValidation;
using OJS.Common.Enumerations;
using OJS.Common.Extensions;
using OJS.Data.Models.Submissions;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.SubmissionTypes;
using OJS.Services.Common.Validation;
using OJS.Workers.Common.Models;

public class SubmissionTypeAdministrationModelValidator : BaseAdministrationModelValidator<SubmissionTypeAdministrationModel, int, SubmissionType>
{
    public SubmissionTypeAdministrationModelValidator(ISubmissionTypesDataService submissionTypesDataService)
        : base(submissionTypesDataService)
    {
        this.RuleFor(model => model.Name)
            .NotNull()
            .NotEmpty()
            .When(x => x.OperationType is CrudOperationType.Create or CrudOperationType.Update)
            .WithMessage("Name field is required");

        this.RuleFor(model => model.CompilerType)
            .MustBeValidEnum<SubmissionTypeAdministrationModel, CompilerType>()
            .When(x => x.OperationType is CrudOperationType.Create or CrudOperationType.Update);

        this.RuleFor(model => model.ExecutionStrategyType)
            .MustBeValidEnum<SubmissionTypeAdministrationModel, ExecutionStrategyType>()
            .When(x => x.OperationType is CrudOperationType.Create or CrudOperationType.Update);

        this.RuleFor(model => model.BaseTimeUsedInMilliseconds)
            .Must(t => t is null or > 0)
            .WithMessage("Base time used must be empty or greater than 0");

        this.RuleFor(model => model.BaseMemoryUsedInBytes)
            .Must(m => m is null or > 0)
            .WithMessage("Base memory used must be empty or greater than 0");
    }
}