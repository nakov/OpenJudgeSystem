namespace OJS.Services.Administration.Business.Participants.Validators;

using FluentValidation;
using OJS.Services.Administration.Models.Participants;
using OJS.Services.Common.Validation;

public class ParticipantAdministrationModelValidator : BaseValidator<ParticipantAdministrationModel>
{
    public ParticipantAdministrationModelValidator()
    {
        this.RuleFor(model => model.Id)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Participant id cannot be less than 0");

        this.RuleFor(model => model.ContestId)
            .GreaterThan(0)
            .WithMessage("Contest id cannot be less or equal to 0");

        this.RuleFor(model => model.ContestName)
            .NotNull()
            .NotEmpty()
            .WithMessage("Contest is required.");

        this.RuleFor(model => model.UserId)
            .NotNull()
            .NotEmpty()
            .WithMessage("User id is required.");

        this.RuleFor(model => model.UserName)
            .NotNull()
            .NotEmpty()
            .WithMessage("UserName is required.");
    }
}