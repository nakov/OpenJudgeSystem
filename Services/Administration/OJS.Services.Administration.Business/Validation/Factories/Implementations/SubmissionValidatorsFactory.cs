namespace OJS.Services.Administration.Business.Validation.Factories.Implementations;

using AutoCrudAdmin.Models;
using AutoCrudAdmin.ViewModels;
using OJS.Data.Models.Submissions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class SubmissionValidatorsFactory : IValidatorsFactory<Submission>
{
    public IEnumerable<Func<Submission, Submission, AdminActionContext, ValidatorResult>> GetValidators()
        => new Func<Submission, Submission, AdminActionContext, ValidatorResult>[]
        {
            ValidateParticipant,
        };

    public IEnumerable<Func<Submission, Submission, AdminActionContext, Task<ValidatorResult>>> GetAsyncValidators()
        => Enumerable.Empty<Func<Submission, Submission, AdminActionContext, Task<ValidatorResult>>>();

    private static ValidatorResult ValidateParticipant(Submission oldEntity, Submission newEntity, AdminActionContext adminActionContext)
        => newEntity.ParticipantId.HasValue
            ? ValidatorResult.Success()
            : ValidatorResult.Error("The participant does not exist.");
}