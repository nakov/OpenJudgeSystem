namespace OJS.Servers.Administration.Controllers;

using AutoCrudAdmin.Enumerations;
using AutoCrudAdmin.Models;
using AutoCrudAdmin.ViewModels;
using FluentExtensions.Extensions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OJS.Common.Enumerations;
using OJS.Common.Extensions;
using OJS.Common.Utils;
using OJS.Data.Models;
using OJS.Data.Models.Contests;
using OJS.Data.Models.Problems;
using OJS.Data.Models.Tests;
using OJS.Servers.Administration.Models.Problems;
using OJS.Servers.Infrastructure.Extensions;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Business.Extensions;
using OJS.Services.Administration.Business.Validation;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models;
using OJS.Services.Administration.Models.Problems;
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
    private readonly IProblemsBusinessService problemsBusiness;
    private readonly IContestsBusinessService contestsBusiness;
    private readonly IContestsDataService contestsData;
    private readonly IProblemsDataService problemsData;
    private readonly IZippedTestsParserService zippedTestsParser;
    private readonly ISubmissionTypesDataService submissionTypesData;
    private readonly IProblemsValidationService problemsValidation;

    public ProblemsController(
        IProblemsBusinessService problemsBusiness,
        IContestsBusinessService contestsBusiness,
        IContestsDataService contestsData,
        IProblemsDataService problemsData,
        IZippedTestsParserService zippedTestsParser,
        ISubmissionTypesDataService submissionTypesData,
        IProblemsValidationService problemsValidation)
    {
        this.problemsBusiness = problemsBusiness;
        this.contestsBusiness = contestsBusiness;
        this.contestsData = contestsData;
        this.problemsData = problemsData;
        this.zippedTestsParser = zippedTestsParser;
        this.submissionTypesData = submissionTypesData;
        this.problemsValidation = problemsValidation;
    }

    public IActionResult ByContest(int contestId)
    {
        this.MasterGridFilter = p => p.ProblemGroup.ContestId == contestId;
        return base.Index();
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

    public IActionResult Tests([FromQuery] IDictionary<string, string> complexId)
    {
        if (!int.TryParse(complexId.Values.FirstOrDefault(), out var id))
        {
            this.TempData.AddDangerMessage(GlobalResource.Invalid_problem);
            return this.RedirectToAction("Index", "Problems");
        }

        return this.RedirectToActionWithNumberFilter(nameof(TestsController), nameof(Test.ProblemId), id);
    }

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
            new GridAction { Action = nameof(this.Tests) },
        };

    protected override IEnumerable<Func<Problem, Problem, AdminActionContext, Task<ValidatorResult>>>
        AsyncEntityValidators
        => this.problemsValidation.GetAsyncValidators();

    protected override IEnumerable<Func<Problem, Problem, AdminActionContext, ValidatorResult>> EntityValidators
        => this.problemsValidation.GetValidators();

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

        var contestId = GetContestId(entityDict, entity);

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

        if (!contest.IsOnline)
        {
            formControls.Add(new FormControlViewModel
            {
                Name = AdditionalFormFields.ProblemGroupType.ToString(),
                Options = EnumUtils.GetValuesFrom<ProblemGroupType>().Cast<object>(),
                Type = typeof(ProblemGroupType),
                Value = entity.ProblemGroup?.Type ?? default(ProblemGroupType),
            });

            formControls.First(x => x.Name == nameof(Data.Models.Problems.Problem.ProblemGroup)).IsHidden = true;
        }

        formControls.Add(new FormControlViewModel
        {
            Name = AdditionalFormFields.SolutionSkeleton.ToString(),
            Value = entity.SolutionSkeleton?.Decompress(),
            Type = typeof(string),
        });

        formControls.Add(new FormControlViewModel
        {
            Name = AdditionalFormFields.Tests.ToString(),
            Type = typeof(IFormFile),
        });

        formControls.Add(new FormControlViewModel
        {
            Name = AdditionalFormFields.AdditionalFiles.ToString(),
            Type = typeof(IFormFile),
        });

        var submissionTypes = entity.SubmissionTypesInProblems.ToList();

        formControls.Add(new FormControlViewModel
        {
            Name = AdditionalFormFields.SubmissionTypes.ToString(),
            Options = this.submissionTypesData
                .GetQuery()
                .ToList()
                .Select(st => new CheckboxFormControlViewModel
                {
                    Name = st.Name,
                    Value = st.Id,
                    IsChecked = submissionTypes.Any(x => x.SubmissionTypeId == st.Id),
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
        var contestId = GetContestId(actionContext.EntityDict, entity);

        if (entity.ProblemGroupId == default)
        {
            entity.ProblemGroup = new ProblemGroup
            {
                ContestId = contestId,
                OrderBy = entity.OrderBy,
                Type = actionContext.GetProblemGroupType().GetValidTypeOrNull(),
            };
        }

        await this.TryAddTestsToProblem(entity, actionContext);
    }

    protected override async Task BeforeEntitySaveOnEditAsync(
        Problem originalEntity,
        Problem newEntity,
        AdminActionContext actionContext)
    {
        if (!originalEntity.ProblemGroup.Contest.IsOnline)
        {
            newEntity.ProblemGroup.OrderBy = newEntity.OrderBy;
        }

        await base.BeforeEntitySaveOnEditAsync(originalEntity, newEntity, actionContext);
    }

    private static int GetContestId(IDictionary<string, string> entityDict, Problem? problem)
        => entityDict.TryGetEntityId<Contest>() ?? problem?.ProblemGroup?.ContestId ?? default;

    private static void TryAddSolutionSkeleton(Problem problem, AdminActionContext actionContext)
        => problem.SolutionSkeleton = actionContext.GetByteArrayFromStringInput(AdditionalFormFields.SolutionSkeleton);

    private static async Task TryAddAdditionalFiles(Problem problem, AdminActionContext actionContext)
    {
        var additionalFiles = actionContext.GetFormFile(AdditionalFormFields.AdditionalFiles);

        if (additionalFiles == null)
        {
            return;
        }

        problem.AdditionalFiles = await additionalFiles.ToByteArray();
    }

    private async Task TryAddTestsToProblem(Problem problem, AdminActionContext actionContext)
    {
        var tests = actionContext.GetFormFile(AdditionalFormFields.Tests);

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
        var newSubmissionTypes = actionContext.GetSubmissionTypes()
            .Where(x => x.IsChecked)
            .Select(x => new SubmissionTypeInProblem
            {
                ProblemId = problem.Id,
                SubmissionTypeId = int.Parse(x.Value!.ToString()!),
            });

        problem.SubmissionTypesInProblems.Clear();
        problem.SubmissionTypesInProblems.AddRange(newSubmissionTypes);
    }
}