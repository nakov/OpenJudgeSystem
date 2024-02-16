namespace OJS.Services.Administration.Business.Problems.Validators;

using OJS.Services.Administration.Models.Problems;
using OJS.Services.Common.Validation;
using FluentValidation;
using OJS.Data.Validation;

public class ProblemAdministrationValidator : BaseValidator<ProblemAdministrationModel>
{
        public ProblemAdministrationValidator()
        {
            this.RuleFor(model => model.Name)
                .Length(1, ConstraintConstants.Problem.NameMaxLength);
            this.RuleFor(model => model.TimeLimit)
                .GreaterThanOrEqualTo(0);
            this.RuleFor(model => model.MemoryLimit)
                .GreaterThanOrEqualTo(0);
            this.RuleFor(model => model.SourceCodeSizeLimit)
                .GreaterThanOrEqualTo(0);
            this.RuleFor(model => model.MaximumPoints)
                .GreaterThanOrEqualTo((short)0);
            this.RuleFor(model => model.SubmissionTypes.Count)
                .GreaterThanOrEqualTo(1);
            this.RuleFor(model => model.ContestId)
                .GreaterThanOrEqualTo(0);

            //TODO: check uploaded files.
        }
}