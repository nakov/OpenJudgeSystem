namespace OJS.Services.Administration.Business.Problems.Validators;

using FluentValidation;
using Microsoft.EntityFrameworkCore;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.Validation;
using System.Linq;
using System.Threading.Tasks;
using OJS.Services.Common;

public class ProblemsDeleteValidator : BaseDeleteValidator<BaseDeleteValidationModel<int>, int>
{
    private readonly IProblemsDataService dataService;
    private readonly IContestsActivityService contestsActivityService;

    public ProblemsDeleteValidator(IProblemsDataService dataService, IContestsActivityService contestsActivityService)
    {
        this.dataService = dataService;
        this.contestsActivityService = contestsActivityService;

        this.RuleFor(model => model.Id)
            .Cascade(CascadeMode.Stop)
            .Must(this.ValidateProblemExists)
            .WithMessage($"Problem was not found.")
            .MustAsync(async (id, cancellation)
                => await this.ValidateContestIsNotActive(id))
            .WithMessage("Cannot delete problem of an active contest.");
    }

    private bool ValidateProblemExists(int id) => this.dataService.GetByIdQuery(id).Any();

    private async Task<bool> ValidateContestIsNotActive(int id)
    {
        var contestId = await this.dataService.GetByIdQuery(id)
            .Select(p => p.ProblemGroup.ContestId)
            .FirstOrDefaultAsync();
        return !await this.contestsActivityService.IsContestActive(contestId);
    }
}