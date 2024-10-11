namespace OJS.Services.Administration.Business.Participants.Validators;

using FluentValidation;
using Microsoft.EntityFrameworkCore;
using OJS.Common.Enumerations;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.Participants;
using OJS.Services.Common.Validation;
using System.Threading.Tasks;

public class ChangeParticipationTimeValidator : BaseValidator<ChangeParticipationTimeModel>
{
    private readonly IContestsDataService contestsDataService;

    public ChangeParticipationTimeValidator(
        IContestsDataService contestsDataService)
    {
        this.contestsDataService = contestsDataService;

        this.RuleFor(model => model.ContestId)
            .Must((model, _) => ContestIdMustBeValid(model.ContestId))
            .WithMessage("Invalid contest id.");

        this.RuleFor(model => model.ContestId)
            .MustAsync(async (contestId, _) => await this.ContestMustExist(contestId))
            .WithMessage("The contest was not found.");

        this.RuleFor(model => model.ContestId)
            .MustAsync(async (contestId, _) => await this.ContestMustBeActive(contestId))
            .WithMessage("The contest must be active.");

        this.RuleFor(model => model.ContestId)
            .MustAsync(async (contestId, _) => await this.ContestMustBeAnOnlineExam(contestId))
            .WithMessage("The contest must be an online exam.");

        this.RuleFor(model => model.ContestId)
            .MustAsync(async (contestId, _) => await this.ContestDurationMustBeSet(contestId))
            .WithMessage("The contest's duration has not been set.");
    }

    private static bool ContestIdMustBeValid(int contestId)
        => contestId > 0;

    private async Task<bool> ContestMustExist(int contestId)
        => await this.contestsDataService.GetByIdQuery(contestId).FirstOrDefaultAsync() != null;

    private async Task<bool> ContestMustBeActive(int contestId)
        => await this.contestsDataService.IsActiveById(contestId);

    private async Task<bool> ContestMustBeAnOnlineExam(int contestId)
    {
        var contest = await this.contestsDataService.GetByIdQuery(contestId).FirstOrDefaultAsync();

        return contest!.Type == ContestType.OnlinePracticalExam;
    }

    private async Task<bool> ContestDurationMustBeSet(int contestId)
    {
        var contest = await this.contestsDataService.GetByIdQuery(contestId).FirstOrDefaultAsync();

        return contest!.Duration.HasValue;
    }

}