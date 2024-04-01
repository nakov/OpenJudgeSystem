namespace OJS.Services.Administration.Business.ProblemGroups.Validators;

using FluentValidation;
using Microsoft.EntityFrameworkCore;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.Validation;
using OJS.Services.Common;
using System.Linq;
using System.Threading.Tasks;

public class ProblemGroupAdministrationDeleteValidator : BaseDeleteValidator<BaseDeleteValidationModel<int>, int>
{
    private readonly IContestsActivityService contestsActivityService;
    private readonly IProblemGroupsDataService problemGroupsDataService;

    public ProblemGroupAdministrationDeleteValidator(
        IContestsActivityService contestsActivityService,
        IProblemGroupsDataService problemGroupsDataService)
    {
        this.contestsActivityService = contestsActivityService;
        this.problemGroupsDataService = problemGroupsDataService;

        this.RuleLevelCascadeMode = CascadeMode.Stop;

        this.RuleFor(model => model.Id)
            .NotNull()
            .GreaterThanOrEqualTo(0)
            .WithMessage("Id cannot be less than 0")
            .MustAsync(async (model, _) => await this.Exists(model))
            .WithMessage("The problem group does not exists.")
            .MustAsync(async (model, _) => await this.NotBeActiveContest(model))
            .WithMessage("Cannot delete problem group when the related contest is active");
    }

    private async Task<bool> Exists(int id)
        => await this.problemGroupsDataService.ExistsById(id);

    private async Task<bool> NotBeActiveContest(int id)
    {
        var contestId = await this.problemGroupsDataService.GetByIdQuery(id)
            .Select(x => x.ContestId)
            .FirstOrDefaultAsync();

        var isContestActive = await this.contestsActivityService.IsContestActive(contestId);
        if (isContestActive)
        {
            return false;
        }

        return true;
    }
}