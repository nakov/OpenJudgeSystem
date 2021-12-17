namespace OJS.Servers.Administration.Controllers;

using AutoCrudAdmin.Controllers;
using AutoCrudAdmin.ViewModels;
using FluentExtensions.Extensions;
using OJS.Common.Enumerations;
using OJS.Common.Extensions;
using OJS.Common.Utils;
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
    private enum AdditionalFields
    {
        SolutionSkeletonData,
        ProblemGroupType,
    }

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

    // TODO: move more logic from old judge
    protected override async Task<IEnumerable<FormControlViewModel>> GenerateFormControlsAsync(
        Problem entity,
        EntityAction action,
        IDictionary<string, string> entityDict,
        IDictionary<string, Expression<Func<object, bool>>> complexOptionFilters)
    {
        complexOptionFilters.Add(
            new KeyValuePair<string, Expression<Func<object, bool>>>(
                nameof(entity.ProblemGroup),
                pg => (pg as ProblemGroup).ContestId == entity.ProblemGroup.ContestId));

        var formControls = await base.GenerateFormControlsAsync(entity, action, entityDict, complexOptionFilters)
            .ToListAsync();

        var contestId = this.GetContestId(entityDict);

        var contest = await this.contestsData.OneById(contestId);

        if (contest == null)
        {
            throw new Exception("Contest not found.");
        }

        formControls.Add(new FormControlViewModel
        {
            Name = AdditionalFields.ProblemGroupType.ToString(),
            Options = EnumUtils.GetValuesFrom<ProblemGroupType>().Cast<object>(),
            Type = typeof(ProblemGroupType),
            Value = entity.ProblemGroup?.Type ?? default(ProblemGroupType),
        });

        formControls.Add(new FormControlViewModel
        {
            Name = AdditionalFields.SolutionSkeletonData.ToString(),
            Value = entity.SolutionSkeleton.Decompress(),
            Type = typeof(string),
        });

        if (entity.ProblemGroup == null || !contest.IsOnline)
        {
            formControls = formControls
                .Where(fc => fc.Name != nameof(Data.Models.Problems.Problem.ProblemGroup))
                .ToList();
        }

        return formControls;
    }

    protected override Task BeforeEntitySaveAsync(Problem entity, EntityAction action, IDictionary<string, string> entityDict)
    {
        entity.SolutionSkeleton = this.GetSolutionSkeleton(entityDict);

        return base.BeforeEntitySaveAsync(entity, action, entityDict);
    }

    // TODO: move more logic from old judge
    protected override Task BeforeEntitySaveOnCreateAsync(Problem entity, IDictionary<string, string> entityDict)
    {
        var contestId = this.GetContestId(entityDict);

        if (entity.ProblemGroupId == default)
        {
            entity.ProblemGroup = new ProblemGroup
            {
                ContestId = contestId,
                OrderBy = entity.OrderBy,
                Type = this.GetProblemGroupType(entityDict).GetValidTypeOrNull(),
            };
        }

        return base.BeforeEntitySaveOnCreateAsync(entity, entityDict);
    }

    protected override Task BeforeEntitySaveOnEditAsync(Problem originalEntity, Problem newEntity, IDictionary<string, string> entityDict)
    {
        // TODO: move logic from old judge
        var contestId = this.GetContestId(entityDict);

        return base.BeforeEntitySaveOnCreateAsync(newEntity, entityDict);
    }

    private async Task<ValidatorResult> ValidateContestPermissions(
        Problem existingEntity,
        Problem newEntity,
        EntityAction action,
        IDictionary<string, string> entityDict)
    {
        var userId = this.User.GetId();
        var isUserAdmin = this.User.IsAdmin();
        var contestId = this.GetContestId(entityDict);

        if (contestId == default)
        {
            return ValidatorResult.Error("A contest should be specified for the problem.");
        }

        if (!await this.contestsBusiness.UserHasContestPermissions(contestId, userId, isUserAdmin))
        {
            return ValidatorResult.Error(GeneralResource.No_permissions_for_contest);
        }

        return ValidatorResult.Success();
    }

    private byte[] GetSolutionSkeleton(IDictionary<string, string> entityDict)
        => entityDict[AdditionalFields.SolutionSkeletonData.ToString()].Compress();

    private int GetContestId(IDictionary<string, string> entityDict)
        => int.Parse(entityDict[this.GetComplexFormControlNameFor<Contest>()]);

    private ProblemGroupType? GetProblemGroupType(IDictionary<string, string> entityDict)
        => entityDict[AdditionalFields.ProblemGroupType.ToString()].ToEnum<ProblemGroupType>();
}