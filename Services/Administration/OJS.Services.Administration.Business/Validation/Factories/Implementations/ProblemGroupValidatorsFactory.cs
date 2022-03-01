namespace OJS.Services.Administration.Business.Validation.Factories.Implementations;

using AutoCrudAdmin.Models;
using AutoCrudAdmin.ViewModels;
using OJS.Data.Models.Contests;
using OJS.Data.Models.Problems;
using OJS.Services.Administration.Business.Extensions;
using OJS.Services.Administration.Business.Validation.Helpers;
using OJS.Services.Administration.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GeneralResource = OJS.Common.Resources.AdministrationGeneral;
using Resource =  OJS.Common.Resources.ProblemGroupsControllers;

public class ProblemGroupValidatorsFactory : IProblemGroupValidatorsFactory
{
    private readonly IContestsValidationHelper contestsValidationHelper;
    private readonly IContestsDataService contestsData;

    public ProblemGroupValidatorsFactory(
        IContestsValidationHelper contestsValidationHelper,
        IContestsDataService contestsData)
    {
        this.contestsValidationHelper = contestsValidationHelper;
        this.contestsData = contestsData;
    }

    public IEnumerable<Func<ProblemGroup, ProblemGroup, AdminActionContext, ValidatorResult>> GetValidators()
        => Enumerable.Empty<Func<ProblemGroup, ProblemGroup, AdminActionContext, ValidatorResult>>();

    public IEnumerable<Func<ProblemGroup, ProblemGroup, AdminActionContext, Task<ValidatorResult>>> GetAsyncValidators()
        => new Func<ProblemGroup, ProblemGroup, AdminActionContext, Task<ValidatorResult>>[]
        {
            this.ValidateContestPermissions,
            this.ValidateContestIsNotActiveOnDelete,
            this.ValidateEditOrderOnlyOnOnlineContest,
            this.ValidateCanCreateOnlyInNonActiveOnlineContest,
        };

    private async Task<ValidatorResult> ValidateContestPermissions(
        ProblemGroup existingEntity,
        ProblemGroup newEntity,
        AdminActionContext actionContext)
    {
        var permissionsResult = await this.contestsValidationHelper.ValidatePermissionsOfCurrentUser(
            actionContext.TryGetEntityId<Contest>());

        return permissionsResult.IsValid
            ? ValidatorResult.Success()
            : ValidatorResult.Error(permissionsResult.Message);
    }

    private async Task<ValidatorResult> ValidateContestIsNotActiveOnDelete(
        ProblemGroup existingEntity,
        ProblemGroup newEntity,
        AdminActionContext actionContext)
    {
        if (actionContext.Action != EntityAction.Delete)
        {
            return ValidatorResult.Success();
        }

        if (await this.contestsData.IsActiveById(existingEntity.ContestId))
        {
            return ValidatorResult.Error(Resource.Active_contest_cannot_delete_problem_group);
        }

        return ValidatorResult.Success();
    }

    private async Task<ValidatorResult> ValidateEditOrderOnlyOnOnlineContest(
        ProblemGroup existingEntity,
        ProblemGroup newEntity,
        AdminActionContext actionContext)
    {
        if (actionContext.Action != EntityAction.Edit)
        {
            return ValidatorResult.Success();
        }

        if (Math.Abs(existingEntity.OrderBy - newEntity.OrderBy) > 0 &&
            !await this.contestsData.IsOnlineById(newEntity.ContestId))
        {
            return ValidatorResult.Error(Resource.Can_edit_orderby_only_in_online_contest);
        }

        return ValidatorResult.Success();
    }

    private async Task<ValidatorResult> ValidateCanCreateOnlyInNonActiveOnlineContest(
        ProblemGroup existingEntity,
        ProblemGroup newEntity,
        AdminActionContext actionContext)
    {
        if (actionContext.Action != EntityAction.Create)
        {
            return ValidatorResult.Success();
        }

        if (!await this.contestsData.IsOnlineById(newEntity.ContestId))
        {
            return ValidatorResult.Error(Resource.Can_create_only_in_online_contest);
        }

        if (await this.contestsData.IsActiveById(newEntity.ContestId))
        {
            return ValidatorResult.Error(Resource.Active_contest_cannot_add_problem_group);
        }

        return ValidatorResult.Success();
    }
}