namespace OJS.Servers.Administration.Controllers;

using AutoCrudAdmin.Controllers;
using AutoCrudAdmin.ViewModels;
using OJS.Data.Models;
using OJS.Servers.Infrastructure.Extensions;
using OJS.Services.Administration.Business;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using GeneralResource = OJS.Common.Resources.AdministrationGeneral;
using Resource = OJS.Common.Resources.ExamGroupsController;

public class UsersInExamGroupsController : AutoCrudAdminController<UserInExamGroup>
{
    private readonly IContestsBusinessService contestsBusiness;

    public UsersInExamGroupsController(IContestsBusinessService contestsBusiness)
        => this.contestsBusiness = contestsBusiness;

    protected override IEnumerable<GridAction> DefaultActions
        => new[] { new GridAction { Action = nameof(this.Delete) } };

    protected override IEnumerable<Func<UserInExamGroup, UserInExamGroup, EntityAction, IDictionary<string, string>, Task<ValidatorResult>>>
        AsyncEntityValidators
        => new Func<UserInExamGroup, UserInExamGroup, EntityAction, IDictionary<string, string>, Task<ValidatorResult>>[]
        {
            this.ValidateContestPermissions,
        };

    private async Task<ValidatorResult> ValidateContestPermissions(
        UserInExamGroup existingEntity,
        UserInExamGroup newEntity,
        EntityAction action,
        IDictionary<string, string> entityDict)
    {
        var userId = this.User.GetId();
        var isUserAdmin = this.User.IsAdmin();
        var contestId = newEntity.ExamGroup.ContestId;

        if (action == EntityAction.Edit)
        {
            return ValidatorResult.Error("Action not permitted");
        }

        if (!contestId.HasValue)
        {
            var message = action == EntityAction.Create
                ? Resource.Cannot_add_users
                : Resource.Cannot_remove_users;

            return ValidatorResult.Error(message);
        }

        if (!await this.contestsBusiness.UserHasContestPermissions(contestId.Value, userId, isUserAdmin))
        {
            return ValidatorResult.Error(GeneralResource.No_permissions_for_contest);
        }

        return ValidatorResult.Success();
    }
}