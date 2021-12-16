namespace OJS.Servers.Administration.Controllers;

using AutoCrudAdmin.Controllers;
using AutoCrudAdmin.ViewModels;
using OJS.Data.Models.Contests;
using OJS.Data.Models.Problems;
using OJS.Servers.Infrastructure.Extensions;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using GeneralResource = OJS.Common.Resources.AdministrationGeneral;

public class ProblemsController : AutoCrudAdminController<Problem>
{
    private readonly IContestsBusinessService contestsBusiness;
    private readonly IContestsDataService contestsData;

    public ProblemsController(IContestsBusinessService contestsBusiness,
        IContestsDataService contestsData)
    {
        this.contestsBusiness = contestsBusiness;
        this.contestsData = contestsData;
    }

    protected override IEnumerable<Func<Problem, Problem, EntityAction, IDictionary<string, string>, Task<ValidatorResult>>> AsyncEntityValidators
        => new Func<Problem, Problem, EntityAction, IDictionary<string, string>, Task<ValidatorResult>>[]
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

        var formControls = base.GenerateFormControls(entity, action, complexOptionFilters).ToList();

        if (action == EntityAction.Create)
        {
            formControls.Add(new FormControlViewModel
            {
                Name = nameof(Contest),
                Options = this.contestsData.GetQuery(),
                Type = typeof(Contest),
                IsComplex = true,
                IsReadOnly = false,
            });
        }

        if (entity.ProblemGroup == null || !entity.ProblemGroup.Contest.IsOnline)
        {
            formControls = formControls
                .Where(fc => fc.Name != nameof(Data.Models.Problems.Problem.ProblemGroup))
                .ToList();
        }

        return formControls;
    }

    protected override Task BeforeEntitySaveOnCreateAsync(Problem entity, IDictionary<string, string> entityDict)
    {
        // TODO: move logic from old judge
        var contestId = int.Parse(entityDict[this.GetComplexFormControlNameFor<Contest>()]);

        return base.BeforeEntitySaveOnCreateAsync(entity, entityDict);
    }

    private async Task<ValidatorResult> ValidateContestPermissions(
        Problem existingEntity,
        Problem newEntity,
        EntityAction action,
        IDictionary<string, string> entityDict)
    {
        var userId = this.User.GetId();
        var isUserAdmin = this.User.IsAdmin();
        int contestId;

        if (action == EntityAction.Create)
        {
            if (!int.TryParse(entityDict[this.GetComplexFormControlNameFor<Contest>()], out contestId))
            {
                return ValidatorResult.Error("A contest should be specified for the problem.");
            }
        }
        else
        {
            contestId = newEntity.ProblemGroup.ContestId;
        }

        if (!await this.contestsBusiness.UserHasContestPermissions(contestId, userId, isUserAdmin))
        {
            return ValidatorResult.Error(GeneralResource.No_permissions_for_contest);
        }

        return ValidatorResult.Success();
    }
}