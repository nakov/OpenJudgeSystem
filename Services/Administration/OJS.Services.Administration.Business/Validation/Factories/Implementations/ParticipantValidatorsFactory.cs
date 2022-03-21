namespace OJS.Services.Administration.Business.Validation.Factories.Implementations;

using AutoCrudAdmin.Models;
using AutoCrudAdmin.ViewModels;
using OJS.Data.Models.Participants;
using OJS.Services.Administration.Business.Validation.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GeneralResource = OJS.Common.Resources.AdministrationGeneral;

public class ParticipantValidatorsFactory : IValidatorsFactory<Participant>
{
    private readonly IContestsValidationHelper contestsValidationHelper;

    public ParticipantValidatorsFactory(
        IContestsValidationHelper contestsValidationHelper)
        => this.contestsValidationHelper = contestsValidationHelper;

    public IEnumerable<Func<Participant, Participant, AdminActionContext, ValidatorResult>> GetValidators()
        => Enumerable.Empty<Func<Participant, Participant, AdminActionContext, ValidatorResult>>();

    public IEnumerable<Func<Participant, Participant, AdminActionContext, Task<ValidatorResult>>> GetAsyncValidators()
        => new Func<Participant, Participant, AdminActionContext, Task<ValidatorResult>>[]
        {
            this.ValidateContestPermissions,
        };

    private async Task<ValidatorResult> ValidateContestPermissions(
        Participant existingParticipant,
        Participant newParticipant,
        AdminActionContext actionContext)
    {
        var permissionsResult = await this.contestsValidationHelper.ValidatePermissionsOfCurrentUser(
            newParticipant.ContestId);

        return permissionsResult.IsValid
            ? ValidatorResult.Success()
            : ValidatorResult.Error(permissionsResult.Message);
    }
}