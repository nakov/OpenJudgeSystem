namespace OJS.Services.Administration.Business.Validation.Factories.Implementations;

using AutoCrudAdmin.Models;
using AutoCrudAdmin.ViewModels;
using OJS.Common.Enumerations;
using OJS.Data.Models.Problems;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GeneralResource = OJS.Common.Resources.AdministrationGeneral;
using Resource = OJS.Common.Resources.ProblemResourcesController;

public class ProblemResourceValidatorsFactory :IValidatorsFactory<ProblemResource>
{
    public IEnumerable<Func<ProblemResource, ProblemResource, AdminActionContext, ValidatorResult>> GetValidators()
        => new Func<ProblemResource, ProblemResource, AdminActionContext, ValidatorResult>[]
        {
            ValidateForResourceType,
        };

    public IEnumerable<Func<ProblemResource, ProblemResource, AdminActionContext, Task<ValidatorResult>>>
        GetAsyncValidators()
        => Enumerable.Empty<Func<ProblemResource, ProblemResource, AdminActionContext, Task<ValidatorResult>>>();

    private static ValidatorResult ValidateForResourceType(
        ProblemResource existingEntity,
        ProblemResource newEntity,
        AdminActionContext actionContext)
    {
        if (newEntity.Type == ProblemResourceType.Link)
        {
            if (!ResourceHasLink(newEntity))
            {
                return ValidatorResult.Error(Resource.Link_not_empty);
            }
            if (ResourceHasFile(actionContext))
            {
                return ValidatorResult.Error(Resource.Only_link_allowed);
            }
        }

        if (actionContext.Action != EntityAction.Create)
        {
            return ValidatorResult.Success();
        }

        if (newEntity.Type != ProblemResourceType.Link && !ResourceHasFile(actionContext))
        {
            return ValidatorResult.Error(Resource.File_required);
        }

        return ValidatorResult.Success();
    }

    private static bool ResourceHasFile(AdminActionContext actionContext)
        => actionContext.Files.SingleFiles.Any();

    private static bool ResourceHasLink(ProblemResource newEntity)
        => !string.IsNullOrWhiteSpace(newEntity.Link);
}