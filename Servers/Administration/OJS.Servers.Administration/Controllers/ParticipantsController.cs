namespace OJS.Servers.Administration.Controllers;

using AutoCrudAdmin.Controllers;
using AutoCrudAdmin.ViewModels;
using OJS.Data.Models.Participants;
using OJS.Servers.Infrastructure.Extensions;
using OJS.Services.Administration.Business;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

public class ParticipantsController : AutoCrudAdminController<Participant>
{
    private readonly IContestsBusinessService contestsBusiness;

    public ParticipantsController(IContestsBusinessService contestsBusiness)
        => this.contestsBusiness = contestsBusiness;

    protected override IEnumerable<GridAction> DefaultActions
        => new[] { new GridAction { Action = nameof(this.Delete) } };

    protected override IEnumerable<Func<Participant, Participant, EntityAction, Task<ValidatorResult>>> AsyncEntityValidators
        => new Func<Participant, Participant, EntityAction, Task<ValidatorResult>>[]
        {
            this.ValidateContestPermissions,
        };

    private async Task<ValidatorResult> ValidateContestPermissions(
        Participant existingParticipant,
        Participant newParticipant,
        EntityAction action)
    {
        var userId = newParticipant.UserId;
        var isUserAdmin = this.User.IsAdmin();

        if (await this.contestsBusiness.UserHasContestPermissions(newParticipant.ContestId, userId, isUserAdmin))
        {
            return ValidatorResult.Success();
        }

        return ValidatorResult.Error("You don't have permissions for this contest.");
    }
}