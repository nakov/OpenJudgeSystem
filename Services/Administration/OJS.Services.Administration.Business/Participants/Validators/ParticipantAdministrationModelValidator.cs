namespace OJS.Services.Administration.Business.Participants.Validators;

using FluentValidation;
using OJS.Common.Enumerations;
using OJS.Data.Models.Participants;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.Participants;
using OJS.Services.Common.Validation;

public class ParticipantAdministrationModelValidator : BaseAdministrationModelValidator<ParticipantAdministrationModel, int, Participant>
{
    public ParticipantAdministrationModelValidator(IParticipantsDataService participantsDataService)
        : base(participantsDataService)
    {
        this.RuleFor(model => model.ContestId)
            .GreaterThan(0)
            .WithMessage("Contest id cannot be less or equal to 0")
            .When(x => x.OperationType is CrudOperationType.Create or CrudOperationType.Update);

        this.RuleFor(model => model.ContestName)
            .NotEmpty()
            .When(x => x.OperationType is CrudOperationType.Create or CrudOperationType.Update);

        this.RuleFor(model => model.UserId)
            .NotEmpty()
            .When(x => x.OperationType is CrudOperationType.Create or CrudOperationType.Update);

        this.RuleFor(model => model.UserName)
            .NotEmpty()
            .When(x => x.OperationType is CrudOperationType.Create or CrudOperationType.Update);
    }
}