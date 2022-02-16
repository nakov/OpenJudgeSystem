namespace OJS.Services.Administration.Business.Validation.Implementations;

using AutoCrudAdmin.Models;
using AutoCrudAdmin.ViewModels;
using OJS.Data.Models.Problems;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GeneralResource = OJS.Common.Resources.AdministrationGeneral;

public class ProblemGroupsValidationService : IProblemGroupsValidationService
{
    private readonly IContestsValidationService contestsValidation;

    public ProblemGroupsValidationService(
        IContestsValidationService contestsValidation)
        => this.contestsValidation = contestsValidation;

    public IEnumerable<Func<ProblemGroup, ProblemGroup, AdminActionContext, ValidatorResult>> GetValidators()
        => Enumerable.Empty<Func<ProblemGroup, ProblemGroup, AdminActionContext, ValidatorResult>>();

    public IEnumerable<Func<ProblemGroup, ProblemGroup, AdminActionContext, Task<ValidatorResult>>> GetAsyncValidators()
        => new Func<ProblemGroup, ProblemGroup, AdminActionContext, Task<ValidatorResult>>[]
        {
            this.ValidateContestPermissions,
        };

    private async Task<ValidatorResult> ValidateContestPermissions(
        ProblemGroup existingEntity,
        ProblemGroup newEntity,
        AdminActionContext actionContext)
        => await this.contestsValidation.ValidateContestPermissionsOfCurrentUser(actionContext);
}