namespace OJS.Services.Administration.Business.Validation.Implementations;

using AutoCrudAdmin.Models;
using AutoCrudAdmin.ViewModels;
using OJS.Data.Models.Participants;
using OJS.Services.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GeneralResource = OJS.Common.Resources.AdministrationGeneral;

public class ParticipantsValidationService : IParticipantsValidationService
{
    private readonly IUserProviderService userProvider;
    private readonly IContestsBusinessService contestsBusiness;

    public ParticipantsValidationService(
        IUserProviderService userProvider,
        IContestsBusinessService contestsBusiness)
    {
        this.userProvider = userProvider;
        this.contestsBusiness = contestsBusiness;
    }

    public IEnumerable<Func<Participant, Participant, AdminActionContext, ValidatorResult>> GetValidators()
        => Enumerable.Empty<Func<Participant, Participant, AdminActionContext, ValidatorResult>>();

    public IEnumerable<Func<Participant, Participant, AdminActionContext, Task<ValidatorResult>>> GetAsyncValidators()
        => new Func<Participant, Participant, AdminActionContext, Task<ValidatorResult>>[]
        {

        };

    private async Task<ValidatorResult> ValidateContestPermissions(
        Participant existingParticipant,
        Participant newParticipant,
        AdminActionContext actionContext)
    {
        var user = this.userProvider.GetCurrentUser();
        var contestId = newParticipant.ContestId;

        if (!await this.contestsBusiness.UserHasContestPermissions(contestId, user.Id, user.IsAdmin))
        {
            return ValidatorResult.Error(GeneralResource.No_permissions_for_contest);
        }

        return ValidatorResult.Success();
    }
}