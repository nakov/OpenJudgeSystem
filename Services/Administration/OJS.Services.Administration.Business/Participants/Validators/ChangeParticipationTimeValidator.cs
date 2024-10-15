namespace OJS.Services.Administration.Business.Participants.Validators;

using FluentValidation;
using FluentValidation.Results;
using Microsoft.EntityFrameworkCore;
using OJS.Common.Enumerations;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.Participants;
using OJS.Services.Common.Validation;
using System.Threading;
using System.Threading.Tasks;

public class ChangeParticipationTimeValidator : BaseValidator<ChangeParticipationTimeModel>
{
    private readonly IContestsDataService contestsDataService;

    public ChangeParticipationTimeValidator(
        IContestsDataService contestsDataService)
    {
        this.contestsDataService = contestsDataService;

        this.RuleFor(model => model)
            .CustomAsync(this.MustHaveValidContest);
    }

    private async Task MustHaveValidContest(
        ChangeParticipationTimeModel model,
        ValidationContext<ChangeParticipationTimeModel> context,
        CancellationToken cancellationToken)
    {
        var contestId = model.ContestId;

        if (contestId <= 0)
        {
            context.AddFailure(
                new ValidationFailure(
                    nameof(model.ContestId),
                    "Invalid contest id."));
        }

        var contest = await this.contestsDataService
            .GetByIdQuery(contestId)
            .FirstOrDefaultAsync(cancellationToken: cancellationToken);

        if (contest == null)
        {
            context.AddFailure(
                new ValidationFailure(
                    nameof(model.ContestId),
                    "The contest was not found."));
        }

        if (!await this.contestsDataService.IsActiveById(contestId))
        {
            context.AddFailure(
                new ValidationFailure(
                    nameof(model.ContestId),
                    "The contest must be active."));
        }

        if (contest!.Type != ContestType.OnlinePracticalExam)
        {
            context.AddFailure(
                new ValidationFailure(
                    nameof(model.ContestId),
                    "The contest must be an online exam."));
        }

        if (!contest.Duration.HasValue)
        {
            context.AddFailure(
                new ValidationFailure(
                    nameof(model.ContestId),
                    "The contest's duration has not been set."));
        }
    }
}