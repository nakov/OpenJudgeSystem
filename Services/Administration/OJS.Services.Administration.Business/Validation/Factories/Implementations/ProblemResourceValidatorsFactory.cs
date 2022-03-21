namespace OJS.Services.Administration.Business.Validation.Factories.Implementations;

using AutoCrudAdmin.Models;
using AutoCrudAdmin.ViewModels;
using OJS.Common.Enumerations;
using OJS.Data.Models.Problems;
using OJS.Services.Administration.Business.Validation.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GeneralResource = OJS.Common.Resources.AdministrationGeneral;
using Resource = OJS.Common.Resources.ProblemResourcesController;

public class ProblemResourceValidatorsFactory : IProblemResourceValidatorsFactory
{
    private readonly IProblemsValidationHelper problemsValidationHelper;

    public ProblemResourceValidatorsFactory(IProblemsValidationHelper problemsValidationHelper)
        => this.problemsValidationHelper = problemsValidationHelper;

    public IEnumerable<Func<ProblemResource, ProblemResource, AdminActionContext, ValidatorResult>> GetValidators()
        => new Func<ProblemResource, ProblemResource, AdminActionContext, ValidatorResult>[]
        {
            this.ValidateForResourceType,
        };

    public IEnumerable<Func<ProblemResource, ProblemResource, AdminActionContext, Task<ValidatorResult>>>
        GetAsyncValidators()
        => new Func<ProblemResource, ProblemResource, AdminActionContext, Task<ValidatorResult>>[]
        {
            this.ValidateProblemPermissions,
        };

    private async Task<ValidatorResult> ValidateProblemPermissions(
        ProblemResource existingEntity,
        ProblemResource newEntity,
        AdminActionContext actionContext)
    {
        var oldProblemPermissionsResult = await this.ValidateProblemPermissions(existingEntity.ProblemId);

        if (oldProblemPermissionsResult.IsValid && existingEntity.ProblemId != newEntity.ProblemId)
        {
            return await this.ValidateProblemPermissions(newEntity.ProblemId);
        }

        return oldProblemPermissionsResult;
    }

    private ValidatorResult ValidateForResourceType(
        ProblemResource existingEntity,
        ProblemResource newEntity,
        AdminActionContext actionContext)
    {
        if (newEntity.Type == ProblemResourceType.Link)
        {
            if (!this.ResourceHasLink(newEntity))
            {
                return ValidatorResult.Error(Resource.Link_not_empty);
            }
            if (this.ResourceHasFile(actionContext))
            {
                return ValidatorResult.Error(Resource.Only_link_allowed);
            }
        }

        if (actionContext.Action != EntityAction.Create)
        {
            return ValidatorResult.Success();
        }

        if (newEntity.Type != ProblemResourceType.Link)
        {
            if (!this.ResourceHasFile(actionContext))
            {
                return ValidatorResult.Error(Resource.File_required);
            }
        }

        return ValidatorResult.Success();
    }

    private bool ResourceHasFile(AdminActionContext actionContext)
        => actionContext.Files.SingleFiles.Any();

    private bool ResourceHasLink(ProblemResource newEntity)
        => !string.IsNullOrWhiteSpace(newEntity.Link);

    private async Task<ValidatorResult> ValidateProblemPermissions(int problemId)
    {
        var permissionsResult = await this.problemsValidationHelper
            .ValidatePermissionsOfCurrentUser(problemId);

        return permissionsResult.IsValid
            ? ValidatorResult.Success()
            : ValidatorResult.Error(GeneralResource.No_permissions_for_contest);
    }
}