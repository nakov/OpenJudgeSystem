namespace OJS.Servers.Administration.Controllers;

using AutoCrudAdmin.Models;
using AutoCrudAdmin.ViewModels;
using OJS.Data.Models.Participants;
using OJS.Services.Administration.Business.Validation.Factories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class ParticipantsController : BaseAutoCrudAdminController<Participant>
{
    private readonly IValidatorsFactory<Participant> participantValidatorsFactory;

    public ParticipantsController(
        IValidatorsFactory<Participant> participantValidatorsFactory)
        => this.participantValidatorsFactory = participantValidatorsFactory;

    protected override IEnumerable<GridAction> DefaultActions
        => new[] { new GridAction { Action = nameof(this.Delete) } };

    protected override IEnumerable<Func<Participant, Participant, AdminActionContext, ValidatorResult>> EntityValidators
        => this.participantValidatorsFactory.GetValidators();

    protected override IEnumerable<Func<Participant, Participant, AdminActionContext, Task<ValidatorResult>>>
        AsyncEntityValidators
        => this.participantValidatorsFactory.GetAsyncValidators();

    protected override IEnumerable<string> ShownFormControlNamesOnCreate
        => base.ShownFormControlNamesOnCreate
            .Concat(new[] { nameof(Participant.Contest), nameof(Participant.User), nameof(Participant.IsOfficial) });


}