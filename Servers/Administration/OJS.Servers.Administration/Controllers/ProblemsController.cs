namespace OJS.Servers.Administration.Controllers;

using AutoCrudAdmin.Controllers;
using AutoCrudAdmin.Models;
using AutoCrudAdmin.ViewModels;
using FluentExtensions.Extensions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OJS.Common;
using OJS.Common.Enumerations;
using OJS.Common.Extensions;
using OJS.Common.Utils;
using OJS.Data.Models.Contests;
using OJS.Data.Models.Problems;
using OJS.Servers.Infrastructure.Extensions;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Data;
using OJS.Services.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using GeneralResource = OJS.Common.Resources.AdministrationGeneral;
using GlobalResource = OJS.Common.Resources.ProblemsController;

public class ProblemsController : AutoCrudAdminController<Problem>
{
    private enum AdditionalFields
    {
        SolutionSkeletonData,
        ProblemGroupType,
        Tests,
        AdditionalFiles,
    }

    private readonly IContestsBusinessService contestsBusiness;
    private readonly IContestsDataService contestsData;
    private readonly IFileSystemService fileSystem;

    public ProblemsController(
        IContestsBusinessService contestsBusiness,
        IContestsDataService contestsData,
        IFileSystemService fileSystem)
    {
        this.contestsBusiness = contestsBusiness;
        this.contestsData = contestsData;
        this.fileSystem = fileSystem;
    }

    public override Task<IActionResult> Create(IDictionary<string, string> complexId, string postEndpointName)
        => base.Create(complexId, nameof(Create));

    [HttpPost]
    public Task<IActionResult> Create(IDictionary<string, string> entityDict, IFormFile tests, IFormFile additionalFiles)
        => base.PostCreate(entityDict, new FormFilesContainer(tests, additionalFiles));

    public override Task<IActionResult> Edit(IDictionary<string, string> complexId, string postEndpointName)
        => base.Edit(complexId, nameof(Edit));

    [HttpPost]
    public Task<IActionResult> Edit(IDictionary<string, string> entityDict, IFormFile tests, IFormFile additionalFiles)
        => base.PostEdit(entityDict, new FormFilesContainer(tests, additionalFiles));

    protected override IEnumerable<Func<Problem, Problem, AdminActionContext, Task<ValidatorResult>>> AsyncEntityValidators
        => new Func<Problem, Problem, AdminActionContext, Task<ValidatorResult>>[]
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

        var contestId = this.GetContestId(entityDict, entity);

        if (contestId == default)
        {
            throw new Exception($"A valid ContestId must be provided to be able to {action} a Problem.");
        }

        var contest = await this.contestsData.OneById(contestId);

        if (contest == null)
        {
            throw new Exception($"Contest with Id: {contestId} not found.");
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

        formControls.Add(new FormControlViewModel
        {
            Name = AdditionalFields.Tests.ToString(),
            Type = typeof(IFormFile),
        });

        formControls.Add(new FormControlViewModel
        {
            Name = AdditionalFields.AdditionalFiles.ToString(),
            Type = typeof(IFormFile),
        });

        if (entity.ProblemGroup == null || !contest.IsOnline)
        {
            formControls = formControls
                .Where(fc => fc.Name != nameof(Data.Models.Problems.Problem.ProblemGroup))
                .ToList();
        }

        return formControls;
    }

    protected override async Task BeforeEntitySaveAsync(Problem entity, AdminActionContext actionContext)
    {
        TryAddSolutionSkeleton(entity, actionContext);
        await TryAddAdditionalFiles(entity, actionContext);
    }

    // TODO: move more logic from old judge
    protected override Task BeforeEntitySaveOnCreateAsync(Problem entity, AdminActionContext actionContext)
    {
        var contestId = this.GetContestId(actionContext.EntityDict, entity);

        if (entity.ProblemGroupId == default)
        {
            entity.ProblemGroup = new ProblemGroup
            {
                ContestId = contestId,
                OrderBy = entity.OrderBy,
                Type = GetProblemGroupType(actionContext.EntityDict).GetValidTypeOrNull(),
            };
        }

        return base.BeforeEntitySaveOnCreateAsync(entity, actionContext);
    }

    protected override Task BeforeEntitySaveOnEditAsync(
        Problem originalEntity,
        Problem newEntity,
        AdminActionContext actionContext)
    {
        // TODO: move logic from old judge
        var contestId = this.GetContestId(actionContext.EntityDict, newEntity);

        return base.BeforeEntitySaveOnCreateAsync(newEntity, actionContext);
    }

    private async Task<ValidatorResult> ValidateContestPermissions(
        Problem existingEntity,
        Problem newEntity,
        AdminActionContext actionContext)
    {
        var userId = this.User.GetId();
        var isUserAdmin = this.User.IsAdmin();
        var contestId = this.GetContestId(actionContext.EntityDict, newEntity);

        if (contestId == default)
        {
            return ValidatorResult.Error("A contest should be specified for the problem.");
        }

        if (!await this.contestsBusiness.UserHasContestPermissions(contestId, userId, isUserAdmin))
        {
            return ValidatorResult.Error(GeneralResource.No_permissions_for_contest);
        }

        return this.ValidateUploadedFiles(actionContext.Files?.SingleFiles);
    }

    private static byte[] GetSolutionSkeleton(IDictionary<string, string> entityDict)
        => entityDict[AdditionalFields.SolutionSkeletonData.ToString()].Compress();

    private int GetContestId(IDictionary<string, string> entityDict, Problem problem)
        => entityDict.TryGetValue(this.GetComplexFormControlNameFor<Contest>(), out var contestIdStr)
            ? int.Parse(entityDict[contestIdStr])
            : problem?.ProblemGroup?.ContestId ?? default;

    private static ProblemGroupType? GetProblemGroupType(IDictionary<string, string> entityDict)
        => entityDict[AdditionalFields.ProblemGroupType.ToString()].ToEnum<ProblemGroupType>();

    private static void TryAddSolutionSkeleton(Problem problem, AdminActionContext actionContext)
        => problem.SolutionSkeleton = GetSolutionSkeleton(actionContext.EntityDict);

    private static async Task TryAddAdditionalFiles(Problem problem, AdminActionContext actionContext)
    {
        var additionalFiles =
            actionContext.Files.SingleFiles.FirstOrDefault(f => f.Name == AdditionalFields.AdditionalFiles.ToString());

        if (additionalFiles != null)
        {
            problem.AdditionalFiles = await additionalFiles.ToByteArray();
        }
    }

    private ValidatorResult ValidateUploadedFiles(IEnumerable<IFormFile> files)
        => files.Any(f => this.fileSystem.GetFileExtension(f) != GlobalConstants.FileExtensions.Zip)
            ? ValidatorResult.Error(GlobalResource.Must_be_zip_file)
            : ValidatorResult.Success();
}