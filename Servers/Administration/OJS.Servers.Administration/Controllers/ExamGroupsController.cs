namespace OJS.Servers.Administration.Controllers;

using AutoCrudAdmin.Controllers;
using AutoCrudAdmin.ViewModels;
using OJS.Data.Models.Contests;
using OJS.Servers.Infrastructure.Extensions;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Data;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Resource = OJS.Common.Resources.ExamGroupsController;

public class ExamGroupsController : AutoCrudAdminController<ExamGroup>
{
    private readonly IContestsBusinessService contestsBusiness;
    private readonly IContestsDataService contestsData;

    public ExamGroupsController(
        IContestsBusinessService contestsBusiness,
        IContestsDataService contestsData)
    {
        this.contestsBusiness = contestsBusiness;
        this.contestsData = contestsData;
    }

    protected override IEnumerable<Func<ExamGroup, ExamGroup, EntityAction, IDictionary<string, string>, Task<ValidatorResult>>> AsyncEntityValidators
        => new Func<ExamGroup, ExamGroup, EntityAction, IDictionary<string, string>, Task<ValidatorResult>>[]
        {
            this.ValidateContestPermissions,
        };

    private async Task<ValidatorResult> ValidateContestPermissions(
        ExamGroup existingEntity,
        ExamGroup newEntity,
        EntityAction action,
        IDictionary<string, string> entityDict)
    {
        var userId = this.User.GetId();
        var isUserAdmin = this.User.IsAdmin();

        if (!newEntity.ContestId.HasValue)
        {
            return ValidatorResult.Success();
        }

        if (!await this.contestsBusiness.UserHasContestPermissions(newEntity.ContestId.Value, userId, isUserAdmin))
        {
            return ValidatorResult.Error(Resource.Cannot_attach_contest);
        }

        if (action == EntityAction.Delete)
        {
            if (await this.contestsData.IsActiveById(newEntity.ContestId.Value))
            {
                return ValidatorResult.Error(Resource.Cannot_delete_group_with_active_contest);
            }
        }

        return ValidatorResult.Success();
    }
}