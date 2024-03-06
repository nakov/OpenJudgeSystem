namespace OJS.Services.Administration.Business.Problems.Validators;

using FluentValidation;
using Microsoft.AspNetCore.Http;
using OJS.Common;
using OJS.Data.Validation;
using OJS.Services.Administration.Models.Problems;
using OJS.Services.Common;
using OJS.Services.Common.Validation;

public class ProblemAdministrationValidator : BaseValidator<ProblemAdministrationModel>
{
    private readonly IFileSystemService fileSystemService;

    public ProblemAdministrationValidator(IFileSystemService fileSystemService)
        {
            this.fileSystemService = fileSystemService;
            this.RuleFor(model => model.Name)
                .Length(1, ConstraintConstants.Problem.NameMaxLength);
            this.RuleFor(model => model.TimeLimit)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Time limit cannot be zero or less.");
            this.RuleFor(model => model.MemoryLimit)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Memory limit cannot be zero or less.");
            this.RuleFor(model => model.SourceCodeSizeLimit)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Source code size limit cannot be zero or less.");
            this.RuleFor(model => model.MaximumPoints)
                .GreaterThanOrEqualTo((short)0)
                .WithMessage("Maximum points cannot be zero or less.");
            this.RuleFor(model => model.SubmissionTypes.Count)
                .GreaterThanOrEqualTo(1)
                .WithMessage("There must be at least one submission type.");
            this.RuleFor(model => model.ContestId)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Must select valid contest.");
            this.RuleFor(model => model.CheckerId)
                .NotNull()
                .WithMessage("Checker cannot be null")
                .GreaterThanOrEqualTo(1)
                .WithMessage("Checker must be valid type");
        }
}