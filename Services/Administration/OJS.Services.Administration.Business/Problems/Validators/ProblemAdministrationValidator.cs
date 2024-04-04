namespace OJS.Services.Administration.Business.Problems.Validators;

using FluentValidation;
using OJS.Common.Enumerations;
using OJS.Data.Models.Problems;
using OJS.Data.Validation;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.Problems;
using OJS.Services.Common;
using OJS.Services.Common.Validation;
using System.Threading.Tasks;

public class ProblemAdministrationValidator : BaseAdministrationModelValidator<ProblemAdministrationModel, int, Problem>
{
    private readonly IContestsActivityService contestsActivityService;

    public ProblemAdministrationValidator(IProblemsDataService problemsDataService, IContestsActivityService contestsActivityService)
        : base(problemsDataService)
        {
            this.contestsActivityService = contestsActivityService;

            this.RuleFor(model => model.Name)
                .Length(1, ConstraintConstants.Problem.NameMaxLength)
                .When(x => x.OperationType is CrudOperationType.Create or CrudOperationType.Update);

            this.RuleFor(model => model.TimeLimit)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Time limit cannot be zero or less.")
                .When(x => x.OperationType is CrudOperationType.Create or CrudOperationType.Update);

            this.RuleFor(model => model.MemoryLimit)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Memory limit cannot be zero or less.")
                .When(x => x.OperationType is CrudOperationType.Create or CrudOperationType.Update);

            this.RuleFor(model => model.SourceCodeSizeLimit)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Source code size limit cannot be zero or less.")
                .When(x => x.OperationType is CrudOperationType.Create or CrudOperationType.Update);

            this.RuleFor(model => model.MaximumPoints)
                .GreaterThanOrEqualTo((short)0)
                .WithMessage("Maximum points cannot be zero or less.")
                .When(x => x.OperationType is CrudOperationType.Create or CrudOperationType.Update);

            this.RuleFor(model => model.SubmissionTypes.Count)
                .GreaterThanOrEqualTo(1)
                .WithMessage("There must be at least one submission type.")
                .When(x => x.OperationType is CrudOperationType.Create or CrudOperationType.Update);

            this.RuleFor(model => model.ContestId)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Must select valid contest.")
                .When(x => x.OperationType is CrudOperationType.Create or CrudOperationType.Update);

            this.RuleFor(model => model.CheckerId)
                .NotNull()
                .WithMessage("Checker cannot be null")
                .GreaterThanOrEqualTo(1)
                .WithMessage("Checker must be valid type")
                .When(x => x.OperationType is CrudOperationType.Create or CrudOperationType.Update);

            this.RuleFor(model => model.ContestId)
                .MustAsync(async (id, _)
                    => await this.ValidateContestIsNotActive(id))
                .When(x => x.OperationType is CrudOperationType.Delete);
        }

    private async Task<bool> ValidateContestIsNotActive(int id)
        => !await this.contestsActivityService.IsContestActive(id);
}