namespace OJS.Servers.Administration.Controllers;

using AutoCrudAdmin.Models;
using AutoCrudAdmin.ViewModels;
using OJS.Data.Models.Participants;
using OJS.Services.Administration.Business.Validation.Factories;
using OJS.Services.Administration.Business.Validation.Helpers;
using OJS.Services.Infrastructure.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class ParticipantsController : BaseAutoCrudAdminController<Participant>
{
    private readonly IValidatorsFactory<Participant> participantValidatorsFactory;
    private readonly IContestsValidationHelper contestsValidationHelper;

    public ParticipantsController(
        IValidatorsFactory<Participant> participantValidatorsFactory,
        IContestsValidationHelper contestsValidationHelper)
    {
        this.participantValidatorsFactory = participantValidatorsFactory;
        this.contestsValidationHelper = contestsValidationHelper;
    }

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

    protected override Task BeforeGeneratingForm(
        Participant entity,
        EntityAction action,
        IDictionary<string, string> entityDict)
        => this.ValidateContestPermissions(entity);

    protected override Task BeforeEntitySaveAsync(Participant entity, AdminActionContext actionContext)
        => this.ValidateContestPermissions(entity);

    private Task ValidateContestPermissions(Participant entity)
        => this.contestsValidationHelper
            .ValidatePermissionsOfCurrentUser(entity.ContestId)
            .VerifyResult();
}