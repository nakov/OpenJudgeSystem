namespace OJS.Services.Administration.Business.Validation.Factories.Implementations;

using AutoCrudAdmin.Models;
using AutoCrudAdmin.ViewModels;
using OJS.Data.Models.Contests;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Resource = OJS.Common.Resources.ExamGroupsController;

public class ExamGroupValidatorsFactory : IValidatorsFactory<ExamGroup>
{
    public IEnumerable<Func<ExamGroup, ExamGroup, AdminActionContext, ValidatorResult>> GetValidators()
        => new Func<ExamGroup, ExamGroup, AdminActionContext, ValidatorResult>[]
        {
            ValidateContestPermissions,
        };

    public IEnumerable<Func<ExamGroup, ExamGroup, AdminActionContext, Task<ValidatorResult>>> GetAsyncValidators()
        => Enumerable.Empty<Func<ExamGroup, ExamGroup, AdminActionContext, Task<ValidatorResult>>>();

    private static ValidatorResult ValidateContestPermissions(
        ExamGroup existingEntity,
        ExamGroup newEntity,
        AdminActionContext actionContext)
    {
        if (actionContext.Action == EntityAction.Delete)
        {
            if (newEntity.Contest?.IsActive ?? false)
            {
                return ValidatorResult.Error(Resource.Cannot_delete_group_with_active_contest);
            }
        }

        return ValidatorResult.Success();
    }
}