namespace OJS.Services.Administration.Business.Validation.Implementations;

using AutoCrudAdmin.Models;
using AutoCrudAdmin.ViewModels;
using OJS.Data.Models.Contests;
using OJS.Services.Administration.Data;
using OJS.Services.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Resource = OJS.Common.Resources.ExamGroupsController;

public class ExamGroupsValidationService : IExamGroupsValidationService
{
    private readonly IUserProviderService userProvider;
    private readonly IContestsBusinessService contestsBusiness;
    private readonly IContestsDataService contestsData;

    public ExamGroupsValidationService(
        IUserProviderService userProvider,
        IContestsBusinessService contestsBusiness,
        IContestsDataService contestsData)
    {
        this.userProvider = userProvider;
        this.contestsBusiness = contestsBusiness;
        this.contestsData = contestsData;
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
        var user = this.userProvider.GetCurrentUser();

        if (!newEntity.ContestId.HasValue)
        {
            return ValidatorResult.Success();
        }

        if (!await this.contestsBusiness.UserHasContestPermissions(newEntity.ContestId.Value, user.Id, user.IsAdmin))
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