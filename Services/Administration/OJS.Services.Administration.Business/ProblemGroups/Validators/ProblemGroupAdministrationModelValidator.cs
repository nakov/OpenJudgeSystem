namespace OJS.Services.Administration.Business.ProblemGroups.Validators;

using FluentValidation;
using OJS.Services.Administration.Models.Contests.Problems;
using OJS.Services.Administration.Models.ProblemGroups;
using OJS.Services.Common;
using OJS.Services.Common.Validation;
using System.Threading.Tasks;
using OJS.Services.Administration.Data;

public class ProblemGroupAdministrationModelValidator : BaseValidator<ProblemGroupsAdministrationModel>
{
    private readonly IContestsActivityService contestsActivityService;
    private readonly IContestsDataService contestsDataService;
    private readonly IProblemGroupsDataService problemGroupsDataService;

    public ProblemGroupAdministrationModelValidator(
        IContestsActivityService contestsActivityService,
        IContestsDataService contestsDataService,
        IProblemGroupsDataService problemGroupsDataService)
    {
        this.contestsActivityService = contestsActivityService;
        this.contestsDataService = contestsDataService;
        this.problemGroupsDataService = problemGroupsDataService;
        this.RuleFor(model => model.Id)
            .NotNull()
            .GreaterThanOrEqualTo(0)
            .WithMessage("Id cannot be less than 0");
        this.RuleFor(model => model.Id)
            .NotNull()
            .MustAsync(async (model, _) => await this.Exists(model))
            .WithMessage("The problem group does not exists.");
        this.RuleFor(model => model.OrderBy)
            .NotNull()
            .GreaterThanOrEqualTo(0)
            .WithMessage("Order by must be greater or equal to 0");
        this.RuleFor(model => model.Contest)
            .NotNull()
            .When(x => x.Id > 0)
            .MustAsync(async (model, _) => await this.NotBeActiveOrOnlineContest(model))
            .WithMessage("Contest which are not online or are active cannot be modified.");
    }

    private async Task<bool> Exists(int id)
        => await this.problemGroupsDataService.ExistsById(id);

    private async Task<bool> NotBeActiveOrOnlineContest(ContestCopyProblemsValidationServiceModel model)
    {
        var isOnline = await this.contestsDataService.IsOnlineById(model.Id);
        if (isOnline == false)
        {
            return false;
        }

        return true;
    }
}