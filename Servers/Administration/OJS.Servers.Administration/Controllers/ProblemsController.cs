namespace OJS.Servers.Administration.Controllers;

using AutoCrudAdmin.Controllers;
using AutoCrudAdmin.ViewModels;
using OJS.Data.Models.Problems;
using OJS.Servers.Infrastructure.Extensions;
using OJS.Services.Administration.Business;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using GeneralResource = OJS.Common.Resources.AdministrationGeneral;

public class ProblemsController : AutoCrudAdminController<Problem>
{
    private readonly IContestsBusinessService contestsBusiness;

    public ProblemsController(IContestsBusinessService contestsBusiness)
        => this.contestsBusiness = contestsBusiness;

    protected override IEnumerable<Func<Problem, Problem, EntityAction, Task<ValidatorResult>>> AsyncEntityValidators
        => new Func<Problem, Problem, EntityAction, Task<ValidatorResult>>[]
        {
            this.ValidateContestPermissions,
        };

    protected override IEnumerable<FormControlViewModel> GenerateFormControls(
        Problem entity,
        EntityAction action,
        IDictionary<string, Expression<Func<object, bool>>> complexOptionFilters)
    {
        complexOptionFilters.Add(
            new KeyValuePair<string, Expression<Func<object, bool>>>(
                nameof(entity.ProblemGroup),
                pg => (pg as ProblemGroup).ContestId == entity.ProblemGroup.ContestId));

        var formControls = base.GenerateFormControls(entity, action, complexOptionFilters);

        if (entity.ProblemGroup == null || !entity.ProblemGroup.Contest.IsOnline)
        {
            formControls = formControls
                .Where(fc => fc.Name != nameof(Data.Models.Problems.Problem.ProblemGroup));
        }

        return formControls;
    }

    private async Task<ValidatorResult> ValidateContestPermissions(
        Problem existingEntity,
        Problem newEntity,
        EntityAction action)
    {
        var userId = this.User.GetId();
        var isUserAdmin = this.User.IsAdmin();
        var contestId = newEntity.ProblemGroup.ContestId;

        if (!await this.contestsBusiness.UserHasContestPermissions(contestId, userId, isUserAdmin))
        {
            return ValidatorResult.Error(GeneralResource.No_permissions_for_contest);
        }

        return ValidatorResult.Success();
    }
}