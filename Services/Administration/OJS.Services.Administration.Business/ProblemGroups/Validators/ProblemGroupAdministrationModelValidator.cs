namespace OJS.Services.Administration.Business.ProblemGroups.Validators;

using FluentValidation;
using Microsoft.EntityFrameworkCore;
using OJS.Common;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.ProblemGroups;
using OJS.Services.Common;
using OJS.Services.Common.Validation;
using System;
using System.Threading.Tasks;
using OJS.Common.Enumerations;

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
            .When(model => model.Id > 0)
            .WithMessage("The problem group does not exists.");

        this.RuleFor(model => model.OrderBy)
            .NotNull()
            .GreaterThanOrEqualTo(0)
            .WithMessage("Order by must be greater or equal to 0");

        this.RuleFor(model => model)
            .NotNull()
            .When(x => x.Id > 0)
            .MustAsync(async (model, _) => await this.NotBeActiveOrOnlineContest(model))
            .WithMessage(
                $"{string.Format(Resources.ProblemGroupsControllers.CanEditOrderbyOnlyInOnlineContest, ContestType.OnlinePracticalExam.ToString())}");

        this.RuleFor(model => model)
            .NotNull()
            .When(x => x.Id == 0)
            .MustAsync(async (model, _) => await this.IsOnline(model.Contest.Id) && !await this.contestsActivityService.IsContestActive(model.Contest.Id))
            .WithMessage($"" +
                         $"{string.Format(Resources.ProblemGroupsControllers.CanCreateOnlyInOnlineContest, ContestType.OnlinePracticalExam.ToString())}" +
                         $" or " +
                         $"{Resources.ProblemGroupsControllers.ActiveContestCannotAddProblemGroup}");
    }

    private async Task<bool> Exists(int id)
        => await this.problemGroupsDataService.ExistsById(id);

    private async Task<bool> NotBeActiveOrOnlineContest(ProblemGroupsAdministrationModel model)
    {
        var problemGroup = await this.problemGroupsDataService.GetByIdQuery(model.Id).AsNoTracking().FirstOrDefaultAsync();
        if (Math.Abs(problemGroup!.OrderBy - model.OrderBy) > 0 && !await this.IsOnline(model.Contest.Id))
        {
            return false;
        }

        return true;
    }

    private async Task<bool> IsOnline(int id)
        => await this.contestsDataService.IsOnlineById(id);
}