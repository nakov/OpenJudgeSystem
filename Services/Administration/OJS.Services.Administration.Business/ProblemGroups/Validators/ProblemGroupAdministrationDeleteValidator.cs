namespace OJS.Services.Administration.Business.ProblemGroups.Validators;

using FluentValidation;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.Validation;
using OJS.Services.Common;
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
        this.RuleFor(model => model.Id)
            .NotNull()
            .GreaterThanOrEqualTo(0)
            .MustAsync(async (model, _) => await this.NotBeActiveContest(model))
            .WithMessage("Id cannot be less than 0");
        this.RuleFor(model => model.Id)
            .NotNull()
            .MustAsync(async (model, _) => await this.Exists(model))
            .WithMessage("The problem group does not exists.");
    }

    private async Task<bool> Exists(int id)
        => await this.problemGroupsDataService.ExistsById(id);
    private async Task<bool> NotBeActiveContest(int id)
    {
        var isContestActive = await this.contestsActivityService.IsContestActive(id);
        if (isContestActive)
        {
            return false;
        }

        return true;
    }
}