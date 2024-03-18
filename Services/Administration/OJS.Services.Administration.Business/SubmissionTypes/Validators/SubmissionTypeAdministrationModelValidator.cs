namespace OJS.Services.Administration.Business.SubmissionTypes.Validators;

using FluentValidation;
using OJS.Common.Extensions;
using OJS.Services.Administration.Models.SubmissionTypes;
using OJS.Services.Common.Validation;
using OJS.Workers.Common.Models;
using System;

public class SubmissionTypeAdministrationModelValidator : BaseValidator<SubmissionTypeAdministrationModel>
{
    public SubmissionTypeAdministrationModelValidator()
    {
        this.RuleFor(model => model.Id)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Id cannot be less than 0");

        this.RuleFor(model => model.Name)
            .NotNull()
            .NotEmpty()
            .WithMessage("Name field is required");

        this.RuleFor(model => model.CompilerType)
            .MustBeValidEnum<SubmissionTypeAdministrationModel, CompilerType>()
            .WithMessage("Compiler type is invalid");

        this.RuleFor(model => model.ExecutionStrategyType)
            .MustBeValidEnum<SubmissionTypeAdministrationModel, ExecutionStrategyType>()
            .WithMessage("Execution strategy type is invalid type");
    }
}