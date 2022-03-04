namespace OJS.Servers.Administration.Controllers;

using AutoCrudAdmin.Enumerations;
using AutoCrudAdmin.Extensions;
using AutoCrudAdmin.Models;
using AutoCrudAdmin.ViewModels;
using FluentExtensions.Extensions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using OJS.Common.Enumerations;
using OJS.Common.Extensions;
using OJS.Common.Utils;
using OJS.Data.Models;
using OJS.Data.Models.Contests;
using OJS.Data.Models.Problems;
using OJS.Data.Models.Tests;
using OJS.Servers.Administration.Infrastructure.Extensions;
using OJS.Servers.Administration.Models.Problems;
using OJS.Servers.Infrastructure.Extensions;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Business.Extensions;
using OJS.Services.Administration.Business.Validation;
using OJS.Services.Administration.Business.Validation.Factories;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models;
using OJS.Services.Administration.Models.Contests.Problems;
using OJS.Services.Infrastructure.Extensions;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using GeneralResource = OJS.Common.Resources.AdministrationGeneral;
using GlobalResource = OJS.Common.Resources.ProblemsController;
using Resource = OJS.Common.Resources.ProblemGroupsControllers;

public class ProblemsController : BaseAutoCrudAdminController<Problem>
{
    private const string ContestIdKey = nameof(OJS.Data.Models.Problems.Problem.ProblemGroup.ContestId);

    private readonly IProblemsBusinessService problemsBusiness;
    private readonly IContestsBusinessService contestsBusiness;
    private readonly IContestsDataService contestsData;
    private readonly IProblemsDataService problemsData;
    private readonly IZippedTestsParserService zippedTestsParser;
    private readonly ISubmissionTypesDataService submissionTypesData;
    private readonly IProblemValidatorsFactory problemValidatorsFactory;
    private readonly IContestDeleteProblemsValidationService contestDeleteProblemsValidation;
    private readonly IContestCopyProblemsValidationService contestCopyProblemsValidation;
    private readonly IProblemGroupsBusinessService problemGroupsBusiness;

    public ProblemsController(
        IProblemsBusinessService problemsBusiness,
        IContestsBusinessService contestsBusiness,
        IContestsDataService contestsData,
        IProblemsDataService problemsData,
        IZippedTestsParserService zippedTestsParser,
        ISubmissionTypesDataService submissionTypesData,
        IProblemValidatorsFactory problemValidatorsFactory,
        IContestDeleteProblemsValidationService contestDeleteProblemsValidation,
        IContestCopyProblemsValidationService contestCopyProblemsValidation,
        IProblemGroupsBusinessService problemGroupsBusiness)
    {
        this.problemsBusiness = problemsBusiness;
        this.contestsBusiness = contestsBusiness;
        this.contestsData = contestsData;
        this.problemsData = problemsData;
        this.zippedTestsParser = zippedTestsParser;
        this.submissionTypesData = submissionTypesData;
        this.problemValidatorsFactory = problemValidatorsFactory;
        this.contestDeleteProblemsValidation = contestDeleteProblemsValidation;
        this.contestCopyProblemsValidation = contestCopyProblemsValidation;
        this.problemGroupsBusiness = problemGroupsBusiness;
    }

    public override IActionResult Index()
    {
        if (!this.TryGetEntityIdForColumnFilter(ContestIdKey, out var contestId))
        {
            return base.Index();
        }

        var routeValues = new Dictionary<string, string>
        {
            { nameof(contestId), contestId.ToString() },
        };

        this.MasterGridFilter = t => t.ProblemGroup.ContestId == contestId;
        this.CustomToolbarActions = new AutoCrudAdminGridToolbarActionViewModel[]
        {
            new()
            {
                Name = "Add new",
                Action = nameof(this.Create),
                RouteValues = routeValues,
            },
            new()
            {
                Name = "Delete all",
                Action = nameof(this.DeleteAll),
                RouteValues = routeValues,
            },
            new()
            {
                Name = "Copy all",
                Action = nameof(this.CopyAll),
                RouteValues = routeValues,
            },
        };

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
            return this.RedirectToActionWithNumberFilter(nameof(ProblemsController), ContestIdKey, problem.ContestId);
        }

        return this.View(problem.Map<ProblemRetestViewModel>());
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

        this.TempData.AddSuccessMessage(GlobalResource.Problem_retested);
        return this.RedirectToAction("Index");
    }

    [HttpGet]
    public async Task<IActionResult> DeleteAll(int? contestId)
    {
        if (!contestId.HasValue)
        {
            this.TempData.AddDangerMessage(GlobalResource.Invalid_contest);
            return this.RedirectToAction("Index", "Problems");
        }

        var contest = await this.contestsData.OneById(contestId);

        await this.contestDeleteProblemsValidation
            .GetValidationResult(contest?.Map<ContestDeleteProblemsValidationServiceModel>())
            .VerifyResult();

        return this.View(contest!.Map<DeleteAllProblemsInContestViewModel>());
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteAll(DeleteAllProblemsInContestViewModel model)
    {
        var contest = await this.contestsData.OneById(model.Id);

        await this.contestDeleteProblemsValidation
            .GetValidationResult(contest?.Map<ContestDeleteProblemsValidationServiceModel>())
            .VerifyResult();

        await this.problemsBusiness.DeleteByContest(contest!.Id);

        this.TempData.AddSuccessMessage(GlobalResource.Problems_deleted);
        return this.RedirectToActionWithNumberFilter(nameof(ProblemsController), ContestIdKey, model.Id);
    }

    [HttpGet]
    public async Task<IActionResult> CopyAll(int? contestId)
    {
        if (!contestId.HasValue)
        {
            this.TempData.AddDangerMessage(GlobalResource.Invalid_contest);
            return this.RedirectToAction("Index", "Problems");
        }

        var contest = await this.contestsData.OneByIdTo<ContestCopyProblemsValidationServiceModel>(contestId);

        await this.contestCopyProblemsValidation
            .GetValidationResult(contest)
            .VerifyResult();

        var model = contest!.Map<CopyAllToAnotherContestViewModel>();
        await this.PrepareViewModelForCopyAll(model, contestId.Value);
        return this.View(model);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> CopyAll(CopyAllToAnotherContestViewModel model)
    {
        if (!this.ModelState.IsValid)
        {
            await this.PrepareViewModelForCopyAll(model, model.FromContestId);
            return this.View(model);
        }

        var sourceContestId = model.FromContestId;
        var destinationContestId = model.Id;

        if (!destinationContestId.HasValue ||
            !await this.contestsData.ExistsById(sourceContestId))
        {
            this.TempData.AddDangerMessage(Resource.Contest_does_not_exist);
            return this.View(model);
        }

        var destinationContest = await this.contestsData
            .OneByIdTo<ContestCopyProblemsValidationServiceModel>(destinationContestId);

        await this.contestCopyProblemsValidation
            .GetValidationResult(destinationContest)
            .VerifyResult();

        var result = await this.problemGroupsBusiness
            .CopyAllToContestBySourceAndDestinationContest(sourceContestId, destinationContestId.Value);

        if (result.IsError)
        {
            this.TempData.AddDangerMessage(result.Error ?? "Copy failed due to an unexpected error");
            await this.PrepareViewModelForCopyAll(model, model.FromContestId);
            return this.View(model);
        }

        this.TempData.AddSuccessMessage(string.Format(
            Resource.Copy_all_problem_groups_success_message,
            await this.contestsData.GetNameById(sourceContestId),
            destinationContest!.Name));
        return this.RedirectToActionWithNumberFilter(nameof(ProblemsController), ContestIdKey, sourceContestId);
    }

    // public async Task<IActionResult> Copy()
    // {
    //
    // }

    protected override IEnumerable<GridAction> CustomActions
        => new []
        {
            new GridAction { Action = nameof(this.Retest) },
            new GridAction { Action = nameof(this.Tests) },
        };

    protected override IEnumerable<Func<Problem, Problem, AdminActionContext, Task<ValidatorResult>>>
        AsyncEntityValidators
        => this.problemValidatorsFactory.GetAsyncValidators();

    protected override IEnumerable<Func<Problem, Problem, AdminActionContext, ValidatorResult>> EntityValidators
        => this.problemValidatorsFactory.GetValidators();

    protected override async Task<IEnumerable<FormControlViewModel>> GenerateFormControlsAsync(
        Problem entity,
        EntityAction action,
        IDictionary<string, string> entityDict,
        IDictionary<string, Expression<Func<object, bool>>> complexOptionFilters)
    {
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

        complexOptionFilters.Add(
            new KeyValuePair<string, Expression<Func<object, bool>>>(
                nameof(entity.ProblemGroup),
                pg => ((ProblemGroup)pg).ContestId == contestId));

        var formControls = await base.GenerateFormControlsAsync(entity, action, entityDict, complexOptionFilters)
            .ToListAsync();

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

    private async Task PrepareViewModelForCopyAll(CopyAllToAnotherContestViewModel model, int fromContestId)
    {
        model.FromContestId = fromContestId;
        model.ContestsToCopyTo = await this.PrepareContestsToCopyTo();
    }

    private async Task<SelectList> PrepareContestsToCopyTo()
    {
        var contestsToCopyTo =
            await this.contestsBusiness.GetAllAvailableForCurrentUser<ContestCopyProblemsValidationServiceModel>();

        return new SelectList(contestsToCopyTo, nameof(Contest.Id), nameof(Contest.Name));
    }
}