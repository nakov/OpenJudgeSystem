namespace OJS.Services.Administration.Business.Problems.Validators;

using FluentValidation;
using Microsoft.EntityFrameworkCore;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.Validation;
using System.Linq;
using System.Threading.Tasks;
using OJS.Services.Common;

public class ProblemsDeleteValidator : BaseDeleteValidator<BaseDeleteValidationModel>
{
    private readonly IProblemsDataService dataService;
    private readonly IContestsActivityService contestsActivityService;
    public ProblemsDeleteValidator(IProblemsDataService dataService, IContestsActivityService contestsActivityService)
    {
        this.dataService = dataService;
        this.contestsActivityService = contestsActivityService;

        this.RuleFor(model => model.Id)
            .Must(this.ValidateProblemExists)
            .WithMessage($"Problem was not found.");

        this.RuleFor(model => model.Id)
            .MustAsync(async (id, cancellation)
                => await this.ValidateContestIsNotActive(id))
            .When(model => model.Id > 0)
            .WithMessage("Cannot delete problem of an active contest.");
    }

    private bool ValidateProblemExists(int id)
    {
        var currentProblem = this.dataService.GetByIdQuery(id)
            .Include(x => x.ProblemGroup)
            .ThenInclude(pg => pg.Contest)
            .FirstOrDefault();

        return currentProblem != null;
    }

    private async Task<bool> ValidateContestIsNotActive(int id)
    {
        var problem = this.dataService.GetByIdQuery(id)
            .Include(x => x.ProblemGroup)
            .ThenInclude(pg => pg.Contest)
            .FirstOrDefault();
        var contestId = problem!.ProblemGroup.ContestId;
        return !await this.contestsActivityService.IsContestActive(contestId);
    }
}