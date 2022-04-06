namespace OJS.Servers.Administration.Controllers;

using AutoCrudAdmin.Models;
using AutoCrudAdmin.ViewModels;
using Microsoft.AspNetCore.Mvc;
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
    public const string ContestIdKey = nameof(Participant.ContestId);

    private readonly IValidatorsFactory<Participant> participantValidatorsFactory;
    private readonly IContestsValidationHelper contestsValidationHelper;

    public ParticipantsController(
        IValidatorsFactory<Participant> participantValidatorsFactory,
        IContestsValidationHelper contestsValidationHelper)
    {
        this.participantValidatorsFactory = participantValidatorsFactory;
        this.contestsValidationHelper = contestsValidationHelper;
    }

    public IActionResult Submissions([FromQuery] IDictionary<string, string> complexId)
        => this.RedirectToActionWithNumberFilter(
            nameof(SubmissionsController),
            SubmissionsController.ParticipantIdKey,
            this.GetEntityIdFromQuery<int>(complexId));

    protected override IEnumerable<GridAction> DefaultActions
        => new[] { new GridAction { Action = nameof(this.Delete) } };

    protected override IEnumerable<GridAction> CustomActions
        => new []
        {
            new GridAction { Action = nameof(this.Submissions) },
        };

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