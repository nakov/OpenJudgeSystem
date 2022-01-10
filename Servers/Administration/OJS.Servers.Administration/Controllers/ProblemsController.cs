namespace OJS.Servers.Administration.Controllers;

using AutoCrudAdmin.Enumerations;
using AutoCrudAdmin.Models;
using AutoCrudAdmin.ViewModels;
using FluentExtensions.Extensions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OJS.Common;
using OJS.Common.Enumerations;
using OJS.Common.Extensions;
using OJS.Common.Utils;
using OJS.Data.Models;
using OJS.Data.Models.Contests;
using OJS.Data.Models.Problems;
using OJS.Servers.Administration.Models.Problems;
using OJS.Servers.Infrastructure.Extensions;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.Problems;
using OJS.Services.Common;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using GeneralResource = OJS.Common.Resources.AdministrationGeneral;
using GlobalResource = OJS.Common.Resources.ProblemsController;

public class ProblemsController : BaseAutoCrudAdminController<Problem>
{
    private enum AdditionalFields
    {
        SolutionSkeletonData,
        ProblemGroupType,
        Tests,
        AdditionalFiles,
        SubmissionTypes,
    }

    private readonly IProblemsBusinessService problemsBusiness;
    private readonly IContestsBusinessService contestsBusiness;
    private readonly IContestsDataService contestsData;
    private readonly IProblemsDataService problemsData;
    private readonly IFileSystemService fileSystem;
    private readonly IZippedTestsParserService zippedTestsParser;
    private readonly ISubmissionTypesDataService submissionTypesData;

    public ProblemsController(
        IProblemsBusinessService problemsBusiness,
        IContestsBusinessService contestsBusiness,
        IContestsDataService contestsData,
        IProblemsDataService problemsData,
        IFileSystemService fileSystem,
        IZippedTestsParserService zippedTestsParser,
        ISubmissionTypesDataService submissionTypesData)
    {
        this.problemsBusiness = problemsBusiness;
        this.contestsBusiness = contestsBusiness;
        this.contestsData = contestsData;
        this.problemsData = problemsData;
        this.fileSystem = fileSystem;
        this.zippedTestsParser = zippedTestsParser;
        this.submissionTypesData = submissionTypesData;
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

    public async Task<IActionResult> Retest([FromQuery] IDictionary<string, string> complexId)
    {
        if (!int.TryParse(complexId.Values.FirstOrDefault(), out var id))
        {
            this.TempData.AddDangerMessage(GlobalResource.Invalid_problem);
            return this.RedirectToAction("Index", "Problems");
        }

        var problem = await this.problemsData.OneByIdTo<ProblemRetestServiceModel>(id);

        if (problem == null)
        {
            this.TempData.AddDangerMessage(GlobalResource.Invalid_problem);
            return this.RedirectToAction("Index", "Problems");
        }

        var userId = this.User.GetId();
        var userIsAdmin = this.User.IsAdmin();

        if (!await this.contestsBusiness.UserHasContestPermissions(problem.ContestId, userId, userIsAdmin))
        {
            this.TempData.AddDangerMessage(GeneralResource.No_privileges_message);
            return this.RedirectToAction("Index", "Problems");
        }

        var referer = this.HttpContext.Request.GetTypedHeaders().Referer;

        if (referer != null)
        {
            this.ViewBag.ReturnUrl = referer.AbsolutePath;
        }

        return this.View("RetestConfirmation", problem.Map<ProblemRetestViewModel>());
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Retest(ProblemRetestViewModel? model)
    {
        if (model == null || !await this.problemsData.ExistsById(model.Id))
        {
            this.TempData.AddDangerMessage(GlobalResource.Invalid_problem);
            return this.RedirectToAction("Index", "Problems");
        }

        var userId = this.User.GetId();
        var userIsAdmin = this.User.IsAdmin();

        if (!await this.contestsBusiness.UserHasContestPermissions(model.ContestId, userId, userIsAdmin))
        {
            this.TempData.AddDangerMessage(GeneralResource.No_privileges_message);
            return this.RedirectToAction("Index", "Problems");
        }

        await this.problemsBusiness.RetestById(model.Id);

        this.TempData.AddInfoMessage(GlobalResource.Problem_retested);
        return this.RedirectToAction("Index");
    }

    protected override IEnumerable<GridAction> CustomActions
        => new []
        {
            new GridAction { Action = nameof(this.Retest) },
        };

    protected override IEnumerable<Func<Problem, Problem, AdminActionContext, Task<ValidatorResult>>> AsyncEntityValidators
        => new Func<Problem, Problem, AdminActionContext, Task<ValidatorResult>>[]
        {
            this.ValidateContestPermissions,
        };

    protected override IEnumerable<Func<Problem, Problem, AdminActionContext, ValidatorResult>> EntityValidators
        => new Func<Problem, Problem, AdminActionContext, ValidatorResult>[]
        {
            ValidateSubmissionTypeIsSelected,
            this.ValidateUploadedFiles,
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
                pg => ((pg as ProblemGroup)!).ContestId == entity.ProblemGroup.ContestId));

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
            Name = this.GetComplexFormControlNameFor<Contest>(),
            Value = contestId,
            Type = typeof(int),
            IsReadOnly = true,
        });

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
            Value = entity.SolutionSkeleton?.Decompress(),
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

        var submissionTypes = entity.SubmissionTypesInProblems.ToList();

        formControls.Add(new FormControlViewModel
        {
            Name = AdditionalFields.SubmissionTypes.ToString(),
            Options = this.submissionTypesData
                .GetQuery()
                .ToList()
                .Select(st => new CheckboxFormControlViewModel
                {
                    Name = st.Name,
                    Value = st.Id,
                    IsSelected = submissionTypes.Any(x => x.SubmissionTypeId == st.Id),
                }),
            FormControlType = FormControlType.MultiChoiceCheckbox,
            Type = typeof(object),
        });

        return formControls;
    }

    protected override async Task BeforeEntitySaveAsync(Problem entity, AdminActionContext actionContext)
    {
        TryAddSolutionSkeleton(entity, actionContext);
        await TryAddAdditionalFiles(entity, actionContext);
        AddSubmissionTypes(entity, actionContext);
    }

    // TODO: move more logic from old judge
    protected override async Task BeforeEntitySaveOnCreateAsync(Problem entity, AdminActionContext actionContext)
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

        await this.TryAddTestsToProblem(entity, actionContext);
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

        return ValidatorResult.Success();
    }

    private static byte[] GetSolutionSkeleton(IDictionary<string, string> entityDict)
        => entityDict[AdditionalFields.SolutionSkeletonData.ToString()].Compress();

    private int GetContestId(IDictionary<string, string> entityDict, Problem? problem)
        => entityDict.TryGetValue(this.GetComplexFormControlNameFor<Contest>(), out var contestIdStr)
            ? int.Parse(contestIdStr)
            : problem?.ProblemGroup?.ContestId ?? default;

    private static IFormFile? GetFormFile(AdminActionContext actionContext, AdditionalFields field)
        => actionContext.Files.SingleFiles.FirstOrDefault(f => f.Name == field.ToString());

    private static ProblemGroupType? GetProblemGroupType(IDictionary<string, string> entityDict)
        => entityDict[AdditionalFields.ProblemGroupType.ToString()].ToEnum<ProblemGroupType>();

    private static IEnumerable<CheckboxFormControlViewModel> GetSubmissionTypes(IDictionary<string, string> entityDict)
        => entityDict[AdditionalFields.SubmissionTypes.ToString()].FromJson<IEnumerable<CheckboxFormControlViewModel>>();

    private static void TryAddSolutionSkeleton(Problem problem, AdminActionContext actionContext)
        => problem.SolutionSkeleton = GetSolutionSkeleton(actionContext.EntityDict);

    private static async Task TryAddAdditionalFiles(Problem problem, AdminActionContext actionContext)
    {
        var additionalFiles = GetFormFile(actionContext, AdditionalFields.AdditionalFiles);

        if (additionalFiles == null)
        {
            return;
        }

        problem.AdditionalFiles = await additionalFiles.ToByteArray();
    }

    private async Task TryAddTestsToProblem(Problem problem, AdminActionContext actionContext)
    {
        var tests = GetFormFile(actionContext, AdditionalFields.Tests);

        if (tests == null)
        {
            return;
        }

        try
        {
            await this.AddTestsToProblem(problem, tests);
        }
        catch (Exception ex)
        {
            throw new Exception(string.Format(GlobalResource.Tests_cannot_be_improrted, ex.Message), ex);
        }
    }

    private async Task AddTestsToProblem(Problem problem, IFormFile testsFile)
    {
        await using var memoryStream = new MemoryStream();
        await testsFile.CopyToAsync(memoryStream);
        memoryStream.Position = 0;

        var parsedTests = await this.zippedTestsParser.Parse(memoryStream);

        if (!this.zippedTestsParser.AreTestsParsedCorrectly(parsedTests))
        {
            throw new ArgumentException(GlobalResource.Invalid_tests);
        }

        this.zippedTestsParser.AddTestsToProblem(problem, parsedTests);
    }

    private static void AddSubmissionTypes(Problem problem, AdminActionContext actionContext)
    {
        var newSubmissionTypes = GetSubmissionTypes(actionContext.EntityDict)
            .Where(x => x.IsSelected)
            .Select(x => new SubmissionTypeInProblem
            {
                ProblemId = problem.Id,
                SubmissionTypeId = int.Parse(x.Value!.ToString()!),
            });

        problem.SubmissionTypesInProblems.Clear();
        problem.SubmissionTypesInProblems.AddRange(newSubmissionTypes);
    }

    private ValidatorResult ValidateUploadedFiles(
        Problem existingEntity,
        Problem newEntity,
        AdminActionContext actionContext)
        => actionContext.Files.SingleFiles.Any(f => this.fileSystem.GetFileExtension(f) != GlobalConstants.FileExtensions.Zip)
            ? ValidatorResult.Error(GlobalResource.Must_be_zip_file)
            : ValidatorResult.Success();

    private static ValidatorResult ValidateSubmissionTypeIsSelected(
        Problem existingEntity,
        Problem newEntity,
        AdminActionContext actionContext)
        => GetSubmissionTypes(actionContext.EntityDict).Any(s => s.IsSelected)
            ? ValidatorResult.Success()
            : ValidatorResult.Error(GlobalResource.Select_one_submission_type);
}