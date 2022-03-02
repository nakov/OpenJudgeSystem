namespace OJS.Services.Administration.Business.Validation.Factories.Implementations;

using AutoCrudAdmin.Models;
using AutoCrudAdmin.ViewModels;
using OJS.Data.Models.Contests;
using OJS.Services.Administration.Business.Validation.Helpers;
using OJS.Services.Administration.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Resource = OJS.Common.Resources.ExamGroupsController;

public class ExamGroupValidatorsFactory : IExamGroupValidatorsFactory
{
    private readonly IContestsDataService contestsData;
    private readonly IContestsValidationHelper contestsValidationHelper;

    public ExamGroupValidatorsFactory(
        IContestsDataService contestsData,
        IContestsValidationHelper contestsValidationHelper)
    {
        this.contestsData = contestsData;
        this.contestsValidationHelper = contestsValidationHelper;
    }

    public IEnumerable<Func<ExamGroup, ExamGroup, AdminActionContext, ValidatorResult>> GetValidators()
        => Enumerable.Empty<Func<ExamGroup, ExamGroup, AdminActionContext, ValidatorResult>>();

    public IEnumerable<Func<ExamGroup, ExamGroup, AdminActionContext, Task<ValidatorResult>>> GetAsyncValidators()
        => new Func<ExamGroup, ExamGroup, AdminActionContext, Task<ValidatorResult>>[]
        {
            this.ValidateContestPermissions,
        };

    private async Task<ValidatorResult> ValidateContestPermissions(
        ExamGroup existingEntity,
        ExamGroup newEntity,
        AdminActionContext actionContext)
    {
        if (!newEntity.ContestId.HasValue)
        {
            return ValidatorResult.Success();
        }

        var permissionsResult = await this.contestsValidationHelper.ValidatePermissionsOfCurrentUser(
            newEntity.ContestId.Value);

        if (!permissionsResult.IsValid)
        {
            return ValidatorResult.Error(Resource.Cannot_attach_contest);
        }

        if (actionContext.Action == EntityAction.Delete)
        {
            if (await this.contestsData.IsActiveById(newEntity.ContestId.Value))
            {
                return ValidatorResult.Error(Resource.Cannot_delete_group_with_active_contest);
            }
        }

        return ValidatorResult.Success();
    }
}