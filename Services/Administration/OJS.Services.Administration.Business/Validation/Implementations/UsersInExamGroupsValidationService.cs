namespace OJS.Services.Administration.Business.Validation.Implementations;

using AutoCrudAdmin.Models;
using AutoCrudAdmin.ViewModels;
using OJS.Data.Models;
using OJS.Services.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GeneralResource = OJS.Common.Resources.AdministrationGeneral;
using Resource = OJS.Common.Resources.ExamGroupsController;

public class UsersInExamGroupsValidationService : IUsersInExamGroupsValidationService
{
    private readonly IUserProviderService userProvider;
    private readonly IContestsBusinessService contestsBusiness;

    public UsersInExamGroupsValidationService(
        IUserProviderService userProvider,
        IContestsBusinessService contestsBusiness)
    {
        this.userProvider = userProvider;
        this.contestsBusiness = contestsBusiness;
    }

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
        var user = this.userProvider.GetCurrentUser();
        var contestId = newEntity.ExamGroup.ContestId;

        if (actionContext.Action == EntityAction.Edit)
        {
            return ValidatorResult.Error("Action not permitted");
        }

        if (!contestId.HasValue)
        {
            var message = actionContext.Action == EntityAction.Create
                ? Resource.Cannot_add_users
                : Resource.Cannot_remove_users;

            return ValidatorResult.Error(message);
        }

        if (!await this.contestsBusiness.UserHasContestPermissions(contestId.Value, user.Id, user.IsAdmin))
        {
            return ValidatorResult.Error(GeneralResource.No_permissions_for_contest);
        }

        return ValidatorResult.Success();
    }
}