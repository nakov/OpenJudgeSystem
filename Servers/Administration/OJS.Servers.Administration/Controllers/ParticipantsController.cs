namespace OJS.Servers.Administration.Controllers;

using AutoCrudAdmin.Models;
using AutoCrudAdmin.ViewModels;
using OJS.Common.Extensions;
using OJS.Data.Models.Participants;
using OJS.Services.Administration.Business;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GeneralResource = OJS.Common.Resources.AdministrationGeneral;

public class ParticipantsController : BaseAutoCrudAdminController<Participant>
{
    private readonly IContestsBusinessService contestsBusiness;

    public ParticipantsController(IContestsBusinessService contestsBusiness)
        => this.contestsBusiness = contestsBusiness;

    protected override IEnumerable<GridAction> DefaultActions
        => new[] { new GridAction { Action = nameof(this.Delete) } };

    protected override IEnumerable<Func<Participant, Participant, AdminActionContext, Task<ValidatorResult>>> AsyncEntityValidators
        => new Func<Participant, Participant, AdminActionContext, Task<ValidatorResult>>[]
        {
            this.ValidateContestPermissions,
        };

    protected override IEnumerable<string> ShownFormControlNamesOnCreate
        => base.ShownFormControlNamesOnCreate
            .Concat(new[] { nameof(Participant.Contest), nameof(Participant.User), nameof(Participant.IsOfficial) });

    private async Task<ValidatorResult> ValidateContestPermissions(
        Participant existingParticipant,
        Participant newParticipant,
        AdminActionContext actionContext)
    {
        var userId = this.User.GetId();
        var isUserAdmin = this.User.IsAdmin();
        var contestId = newParticipant.ContestId;

        if (!await this.contestsBusiness.UserHasContestPermissions(contestId, userId, isUserAdmin))
        {
            return ValidatorResult.Error(GeneralResource.No_permissions_for_contest);
        }

        return ValidatorResult.Success();
    }
}