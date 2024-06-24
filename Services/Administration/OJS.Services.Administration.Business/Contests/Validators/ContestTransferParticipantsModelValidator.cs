namespace OJS.Services.Administration.Business.Contests.Validators;

using OJS.Services.Administration.Data;
using FluentValidation;
using OJS.Services.Common.Validation;
using OJS.Services.Administration.Models.Contests;
using System.Linq;
using System.Threading.Tasks;

public class ContestTransferParticipantsModelValidator : BaseValidator<ContestTransferParticipantsModel>
{
    private readonly IContestsDataService contestsData;

    public ContestTransferParticipantsModelValidator(
        IContestsDataService contestsData)
    {
        this.contestsData = contestsData;

        this.RuleFor(model => model.ContestId)
            .Must((model, _) => ContestIdMustBeValid(model.ContestId))
            .WithMessage("Invalid contest id.");

        this.RuleFor(model => model.ContestId)
            .Must((model, _) => this.ContestMustExist(model.ContestId))
            .WithMessage("The contest was not found.");

        this.RuleFor(model => model.ContestId)
            .MustAsync(async (contestId, _) => await this.ContestMustNotBeActive(contestId))
            .WithMessage("The contest must not be active.");

        this.RuleFor(model => model.ContestId)
            .MustAsync(async (contestId, _) => await this.ContestMustHaveParticipants(contestId))
            .WithMessage("The contest must have participants in \"Compete\".");
    }

    private static bool ContestIdMustBeValid(int contestId)
        => contestId > 0;

    private bool ContestMustExist(int contestId)
        => this.contestsData.GetByIdQuery(contestId).FirstOrDefault() != null;

    private async Task<bool> ContestMustNotBeActive(int contestId)
        => !await this.contestsData.IsActiveById(contestId);

    private async Task<bool> ContestMustHaveParticipants(int contestId)
    {
        var contest = await this.contestsData.GetByIdWithParticipants(contestId);

        return contest!.Participants.Any(p => p.IsOfficial);
    }
}