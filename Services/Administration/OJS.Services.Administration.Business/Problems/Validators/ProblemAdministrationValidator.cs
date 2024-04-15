namespace OJS.Services.Administration.Business.Problems.Validators;

using FluentValidation;
using Microsoft.EntityFrameworkCore;
using OJS.Common.Enumerations;
using OJS.Data.Models.Problems;
using OJS.Data.Validation;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.Problems;
using OJS.Services.Common;
using OJS.Services.Common.Validation;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class ProblemAdministrationValidator : BaseAdministrationModelValidator<ProblemAdministrationModel, int, Problem>
{
    private readonly IProblemsDataService problemsDataService;
    private readonly IContestsActivityService contestsActivityService;
    private readonly int maxTimeLimitValue = 50000;
    private readonly int maxMemoryLimitValue = int.MaxValue;

    public ProblemAdministrationValidator(IProblemsDataService problemsDataService, IContestsActivityService contestsActivityService)
        : base(problemsDataService)
        {
            this.problemsDataService = problemsDataService;
            this.contestsActivityService = contestsActivityService;

            this.RuleFor(model => model.Name)
                .Length(1, ConstraintConstants.Problem.NameMaxLength)
                .When(x => x.OperationType is CrudOperationType.Create or CrudOperationType.Update);

            this.RuleFor(model => model.TimeLimit)
                .GreaterThan(0)
                .WithMessage("Time limit cannot be zero or less.")
                .When(x => x.OperationType is CrudOperationType.Create or CrudOperationType.Update);

            this.RuleFor(model => model.MemoryLimit)
                .GreaterThan(0)
                .WithMessage("Memory limit cannot be zero or less.")
                .When(x => x.OperationType is CrudOperationType.Create or CrudOperationType.Update);

            this.RuleFor(model => model.SourceCodeSizeLimit)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Source code size limit cannot be zero or less.")
                .When(x => x.OperationType is CrudOperationType.Create or CrudOperationType.Update);

            this.RuleFor(model => model.MaximumPoints)
                .GreaterThanOrEqualTo((short)0)
                .When(x => x.OperationType is CrudOperationType.Create or CrudOperationType.Update)
                .WithMessage("Maximum points cannot be zero or less.");

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

            this.RuleFor(model => model.Id)
                .MustAsync(async (id, _) => await this.ContestMustNotBeActive(id))
                .When(x => x.OperationType is CrudOperationType.Delete);

            this.RuleFor(model => model.SubmissionTypes)
                .Must(this.MustHaveValidSubmissionTypeDetails)
                .When(x => x.OperationType is CrudOperationType.Create or CrudOperationType.Update);
        }

    private async Task<bool> ContestMustNotBeActive(int problemId)
    {
        var contestId = await this.problemsDataService
            .GetByIdQuery(problemId)
            .Select(x => x.ProblemGroup.ContestId)
            .FirstAsync();

        return !await this.contestsActivityService.IsContestActive(contestId);
    }

    private bool MustHaveValidSubmissionTypeDetails(IEnumerable<ProblemSubmissionType> problemSubmissionTypes)
    {
        foreach (var problemSubmissionType in problemSubmissionTypes)
        {
            if (problemSubmissionType.TimeLimit <= 0 || problemSubmissionType.TimeLimit > this.maxTimeLimitValue)
            {
                return false;
            }

            if (problemSubmissionType.MemoryLimit <= 0 || problemSubmissionType.MemoryLimit > this.maxMemoryLimitValue)
            {
                return false;
            }
        }

        return true;
    }
}