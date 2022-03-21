namespace OJS.Services.Administration.Business.Validation.Factories.Implementations;

using AutoCrudAdmin.Models;
using AutoCrudAdmin.ViewModels;
using OJS.Data.Models.Participants;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GeneralResource = OJS.Common.Resources.AdministrationGeneral;

public class ParticipantValidatorsFactory : IValidatorsFactory<Participant>
{
    public IEnumerable<Func<Participant, Participant, AdminActionContext, ValidatorResult>> GetValidators()
        => Enumerable.Empty<Func<Participant, Participant, AdminActionContext, ValidatorResult>>();

    public IEnumerable<Func<Participant, Participant, AdminActionContext, Task<ValidatorResult>>> GetAsyncValidators()
        => Enumerable.Empty<Func<Participant, Participant, AdminActionContext, Task<ValidatorResult>>>();
}