namespace OJS.Services.Administration.Business.Validation.Factories.Implementations;

using AutoCrudAdmin.Models;
using AutoCrudAdmin.ViewModels;
using OJS.Data.Models;
using OJS.Services.Administration.Business.Validation.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GeneralResource = OJS.Common.Resources.AdministrationGeneral;
using Resource = OJS.Common.Resources.ExamGroupsController;

public class UserInExamGroupValidatorsFactory : IUserInExamGroupValidatorsFactory
{
    private readonly IContestsValidationHelper contestsValidationHelper;

    public UserInExamGroupValidatorsFactory(
        IContestsValidationHelper contestsValidationHelper)
        => this.contestsValidationHelper = contestsValidationHelper;

    public IEnumerable<Func<UserInExamGroup, UserInExamGroup, AdminActionContext, ValidatorResult>> GetValidators()
        => Enumerable.Empty<Func<UserInExamGroup, UserInExamGroup, AdminActionContext, ValidatorResult>>();

    public IEnumerable<Func<UserInExamGroup, UserInExamGroup, AdminActionContext, Task<ValidatorResult>>> GetAsyncValidators()
        => new Func<UserInExamGroup, UserInExamGroup, AdminActionContext, Task<ValidatorResult>>[]
        {
            this.ValidateContestPermissions,
        };

    private async Task<ValidatorResult> ValidateContestPermissions(
        UserInExamGroup existingEntity,
        UserInExamGroup newEntity,
        AdminActionContext actionContext)
    {
        if (actionContext.Action == EntityAction.Edit)
        {
            return ValidatorResult.Error("Action not permitted");
        }

        var contestId = newEntity.ExamGroup.ContestId;

        if (!contestId.HasValue)
        {
            var message = actionContext.Action == EntityAction.Create
                ? Resource.Cannot_add_users
                : Resource.Cannot_remove_users;

            return ValidatorResult.Error(message);
        }

        var permissionsResult = await this.contestsValidationHelper.ValidatePermissionsOfCurrentUser(
            contestId);

        return permissionsResult.IsValid
            ? ValidatorResult.Success()
            : ValidatorResult.Error(GeneralResource.No_permissions_for_contest);
    }
}