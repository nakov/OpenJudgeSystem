namespace OJS.Servers.Administration.Controllers;

using AutoCrudAdmin.Enumerations;
using AutoCrudAdmin.Extensions;
using AutoCrudAdmin.Models;
using AutoCrudAdmin.ViewModels;
using FluentExtensions.Extensions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using OJS.Common.Enumerations;
using OJS.Common.Extensions;
using OJS.Common.Utils;
using OJS.Data.Models;
using OJS.Data.Models.Contests;
using OJS.Data.Models.Problems;
using OJS.Servers.Administration.Extensions;
using OJS.Servers.Administration.Models.Problems;
using OJS.Servers.Infrastructure.Extensions;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Business.Contests;
using OJS.Services.Administration.Business.Extensions;
using OJS.Services.Administration.Business.ProblemGroups;
using OJS.Services.Administration.Business.Problems;
using OJS.Services.Administration.Business.Validation.Factories;
using OJS.Services.Administration.Business.Validation.Helpers;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models;
using OJS.Services.Administration.Models.Contests.Problems;
using OJS.Services.Administration.Models.Problems;
using OJS.Services.Common;
using OJS.Services.Common.Validation;
using OJS.Services.Infrastructure.Exceptions;
using OJS.Services.Infrastructure.Extensions;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using GlobalResource = OJS.Common.Resources.ProblemsController;
using Resource = OJS.Common.Resources.ProblemGroupsControllers;

public class ProblemsController : BaseAutoCrudAdminController<Problem>
{
    public const string ContestIdKey = nameof(OJS.Data.Models.Problems.Problem.ProblemGroup.ContestId);
    private const string CheckerName = nameof(Data.Models.Problems.Problem.Checker);

    private readonly IProblemsBusinessService problemsBusiness;
    private readonly IContestsBusinessService contestsBusiness;
    private readonly ILecturerContestPrivilegesBusinessService lecturerContestPrivilegesBusiness;
    private readonly IContestsDataService contestsData;
    private readonly IProblemsDataService problemsData;
    private readonly IZippedTestsParserService zippedTestsParser;
    private readonly ISubmissionTypesDataService submissionTypesData;
    private readonly IValidatorsFactory<Problem> problemValidatorsFactory;
    private readonly IValidationService<ContestDeleteProblemsValidationServiceModel> contestDeleteProblemsValidation;
    private readonly IValidationService<ContestCopyProblemsValidationServiceModel> contestCopyProblemsValidation;
    private readonly IProblemGroupsBusinessService problemGroupsBusiness;
    private readonly IProblemGroupsDataService problemGroupsData;
    private readonly IContestsValidationHelper contestsValidationHelper;
    private readonly IContestsActivityService contestsActivity;

    public ProblemsController(
        IProblemsBusinessService problemsBusiness,
        IContestsBusinessService contestsBusiness,
        ILecturerContestPrivilegesBusinessService lecturerContestPrivilegesBusiness,
        IContestsDataService contestsData,
        IProblemsDataService problemsData,
        IZippedTestsParserService zippedTestsParser,
        ISubmissionTypesDataService submissionTypesData,
        IValidatorsFactory<Problem> problemValidatorsFactory,
        IValidationService<ContestDeleteProblemsValidationServiceModel> contestDeleteProblemsValidation,
        IValidationService<ContestCopyProblemsValidationServiceModel> contestCopyProblemsValidation,
        IProblemGroupsBusinessService problemGroupsBusiness,
        IProblemGroupsDataService problemGroupsData,
        IContestsValidationHelper contestsValidationHelper,
        IContestsActivityService contestsActivity,
        IOptions<ApplicationConfig> appConfigOptions)
        : base(appConfigOptions)
    {
        this.problemsBusiness = problemsBusiness;
        this.contestsBusiness = contestsBusiness;
        this.lecturerContestPrivilegesBusiness = lecturerContestPrivilegesBusiness;
        this.contestsData = contestsData;
        this.problemsData = problemsData;
        this.zippedTestsParser = zippedTestsParser;
        this.submissionTypesData = submissionTypesData;
        this.problemValidatorsFactory = problemValidatorsFactory;
        this.contestDeleteProblemsValidation = contestDeleteProblemsValidation;
        this.contestCopyProblemsValidation = contestCopyProblemsValidation;
        this.problemGroupsBusiness = problemGroupsBusiness;
        this.problemGroupsData = problemGroupsData;
        this.contestsValidationHelper = contestsValidationHelper;
        this.contestsActivity = contestsActivity;
    }

    protected override Expression<Func<Problem, bool>>? MasterGridFilter
        => this.GetMasterGridFilter();

    protected override IEnumerable<AutoCrudAdminGridToolbarActionViewModel> CustomToolbarActions
        => this.TryGetEntityIdForNumberColumnFilter(ContestIdKey, out var problemId)
            ? this.GetCustomToolbarActions(problemId)
            : base.CustomToolbarActions;

    protected override IEnumerable<GridAction> CustomActions
        => new[]
        {
            new GridAction { Action = nameof(this.Retest) }, new GridAction { Action = nameof(this.Tests) },
            new GridAction { Action = nameof(this.Copy) }, new GridAction { Action = nameof(this.Resources) },
            new GridAction { Action = nameof(this.Submissions) },
        };

    protected override IEnumerable<Func<Problem, Problem, AdminActionContext, Task<ValidatorResult>>>
        AsyncEntityValidators
        => this.problemValidatorsFactory.GetAsyncValidators();

    protected override IEnumerable<Func<Problem, Problem, AdminActionContext, ValidatorResult>> EntityValidators
        => this.problemValidatorsFactory.GetValidators();

    public override Task<IActionResult> Create(IDictionary<string, string> complexId, string? postEndpointName)
        => base.Create(complexId, nameof(this.Create));

    [HttpPost]
    public Task<IActionResult> Create(IDictionary<string, string> entityDict, IFormFile tests, IFormFile additionalFiles)
        => this.PostCreate(entityDict, new FormFilesContainer(tests, additionalFiles));

    public override Task<IActionResult> Edit(IDictionary<string, string> complexId, string? postEndpointName)
        => base.Edit(complexId, nameof(this.Edit));

    [HttpPost]
    public Task<IActionResult> Edit(IDictionary<string, string> entityDict, IFormFile tests, IFormFile additionalFiles)
        => this.PostEdit(entityDict, new FormFilesContainer(tests, additionalFiles));

    public IActionResult Tests([FromQuery] IDictionary<string, string> complexId)
        => this.RedirectToActionWithNumberFilter(
            nameof(TestsController),
            TestsController.ProblemIdKey,
            this.GetEntityIdFromQuery<int>(complexId));

    public IActionResult Resources([FromQuery] IDictionary<string, string> complexId)
        => this.RedirectToActionWithNumberFilter(
            nameof(ProblemResourcesController),
            ProblemResourcesController.ProblemIdKey,
            this.GetEntityIdFromQuery<int>(complexId));

    public IActionResult Submissions([FromQuery] IDictionary<string, string> complexId)
        => this.RedirectToActionWithNumberFilter(
            nameof(SubmissionsController),
            SubmissionsController.ProblemIdKey,
            this.GetEntityIdFromQuery<int>(complexId));

    public async Task<IActionResult> Retest([FromQuery] IDictionary<string, string> complexId)
    {
        var id = this.GetEntityIdFromQuery<int>(complexId);

        var problem = await this.problemsData.OneByIdTo<ProblemRetestServiceModel>(id);

        if (problem == null)
        {
            this.TempData.AddDangerMessage(GlobalResource.InvalidProblem);
            return this.RedirectToAction("Index", "Problems");
        }

        try
        {
            await this.contestsValidationHelper
                .ValidatePermissionsOfCurrentUser(problem.ContestId)
                .VerifyResult();
        }
        catch (BusinessServiceException e)
        {
            this.TempData.AddDangerMessage(e.Message);
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
            this.TempData.AddDangerMessage(GlobalResource.InvalidProblem);
            return this.RedirectToAction("Index", "Problems");
        }

        try
        {
            await this.contestsValidationHelper
                .ValidatePermissionsOfCurrentUser(model.ContestId)
                .VerifyResult();
        }
        catch (BusinessServiceException e)
        {
            this.TempData.AddDangerMessage(e.Message);
            return this.RedirectToAction("Index", "Problems");
        }

        await this.problemsBusiness.RetestById(model.Id);

        this.TempData.AddSuccessMessage(GlobalResource.ProblemRetested);
        return this.RedirectToAction("Index");
    }

    [HttpGet]
    public async Task<IActionResult> DeleteAll(int? contestId)
    {
        if (!contestId.HasValue)
        {
            this.TempData.AddDangerMessage(GlobalResource.InvalidContest);
            return this.RedirectToAction("Index", "Problems");
        }

        var contest = await this.contestsActivity.GetContestActivity(contestId.Value);

        var validationModel = new ContestDeleteProblemsValidationServiceModel
        {
            Id = contestId.Value, IsActive = await this.contestsActivity.IsContestActive(contestId.Value),
        };

        this.contestDeleteProblemsValidation
            .GetValidationResult(validationModel)
            .VerifyResult();

        await this.contestsValidationHelper
            .ValidatePermissionsOfCurrentUser(validationModel.Id)
            .VerifyResult();

        var modelResult = contest.Map<DeleteAllProblemsInContestViewModel>();

        return this.View(modelResult);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteAll(DeleteAllProblemsInContestViewModel model)
    {
        var validationModel = new ContestDeleteProblemsValidationServiceModel
        {
            Id = model.Id, IsActive = await this.contestsActivity.IsContestActive(model.Id),
        };

        this.contestDeleteProblemsValidation
            .GetValidationResult(validationModel)
            .VerifyResult();

        await this.contestsValidationHelper
            .ValidatePermissionsOfCurrentUser(validationModel.Id)
            .VerifyResult();

        await this.problemsBusiness.DeleteByContest(validationModel.Id);

        this.TempData.AddSuccessMessage(GlobalResource.ProblemsDeleted);
        return this.RedirectToActionWithNumberFilter(nameof(ProblemsController), ContestIdKey, model.Id);
    }

    [HttpGet]
    public async Task<IActionResult> CopyAll(int? contestId)
    {
        if (!contestId.HasValue)
        {
            this.TempData.AddDangerMessage(GlobalResource.InvalidContest);
            return this.RedirectToAction("Index", "Problems");
        }

        var contest = await this.contestsData.OneByIdTo<ContestCopyProblemsValidationServiceModel>(contestId);

        this.contestCopyProblemsValidation
            .GetValidationResult(contest)
            .VerifyResult();

        await this.contestsValidationHelper
            .ValidatePermissionsOfCurrentUser(contest!.Id)
            .VerifyResult();

        var model = contest.Map<CopyAllToAnotherContestViewModel>();
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
            this.TempData.AddDangerMessage(Resource.ContestDoesNotExist);
            return this.View(model);
        }

        var destinationContest = await this.contestsData
            .OneByIdTo<ContestCopyProblemsValidationServiceModel>(destinationContestId);

        this.contestCopyProblemsValidation
            .GetValidationResult(destinationContest)
            .VerifyResult();

        await this.contestsValidationHelper
            .ValidatePermissionsOfCurrentUser(destinationContest!.Id)
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
            Resource.CopyAllProblemGroupsSuccessMessage,
            await this.contestsData.GetNameById(sourceContestId),
            destinationContest.Name));
        return this.RedirectToActionWithNumberFilter(nameof(ProblemsController), ContestIdKey, sourceContestId);
    }

    [HttpGet]
    public async Task<IActionResult> Copy(IDictionary<string, string> complexId)
    {
        var id = this.GetEntityIdFromQuery<int>(complexId);
        var problem = this.problemsData.GetWithContestById(id);

        if (problem == null)
        {
            this.TempData.AddDangerMessage(GlobalResource.InvalidProblem);
            return this.RedirectToAction("Index", "Problems");
        }

        var contest = problem.ProblemGroup.Contest;

        this.contestCopyProblemsValidation
            .GetValidationResult(contest.Map<ContestCopyProblemsValidationServiceModel>())
            .VerifyResult();

        await this.contestsValidationHelper
            .ValidatePermissionsOfCurrentUser(contest.Id)
            .VerifyResult();

        var model = problem.Map<CopyToAnotherContestViewModel>();
        await this.PrepareViewModelForCopy(model);
        return this.View(model);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Copy(CopyToAnotherContestViewModel model)
    {
        var contestId = model.ToContestId;
        int? problemGroupId = model.ToProblemGroupId == default ? null : model.ToProblemGroupId;

        if (!this.ModelState.IsValid)
        {
            await this.PrepareViewModelForCopy(model);
            return this.View(model);
        }

        if (!await this.problemsData.ExistsById(model.FromProblemId))
        {
            throw new BusinessServiceException(GlobalResource.InvalidProblem);
        }

        var validationModel = model.Map<ContestCopyProblemsValidationServiceModel>();

        this.contestCopyProblemsValidation
            .GetValidationResult(validationModel)
            .VerifyResult();

        await this.contestsValidationHelper
            .ValidatePermissionsOfCurrentUser(validationModel.Id)
            .VerifyResult();

        if (problemGroupId.HasValue &&
            !this.problemGroupsData.IsFromContestByIdAndContest(problemGroupId.Value, contestId!.Value))
        {
            throw new BusinessServiceException(GlobalResource.InvalidProblemGroup);
        }

        var result = await this.problemsBusiness.CopyToContestByIdByContestAndProblemGroup(
            model.FromProblemId,
            contestId!.Value,
            problemGroupId);

        if (result.IsError)
        {
            this.TempData.AddDangerMessage(result.Error);
            await this.PrepareViewModelForCopy(model);
            return this.View(model);
        }

        this.TempData.AddSuccessMessage(string.Format(
            GlobalResource.CopyProblemSuccessMessage,
            this.problemsData.GetNameById(model.FromProblemId),
            this.contestsData.GetNameById(contestId.Value)));
        return this.RedirectToActionWithNumberFilter(nameof(ProblemsController), ContestIdKey, model.FromContestId);
    }

    protected override async Task<IEnumerable<FormControlViewModel>> GenerateFormControlsAsync(
        Problem entity,
        EntityAction action,
        IDictionary<string, string> entityDict,
        IDictionary<string, Expression<Func<object, bool>>> complexOptionFilters,
        Type? autocompleteType)
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

        var formControls = await base.GenerateFormControlsAsync(entity, action, entityDict, complexOptionFilters, autocompleteType)
            .ToListAsync();

        await this.ModifyFormControls(formControls, entity, action, entityDict).ConfigureAwait(false);

        formControls.Add(new FormControlViewModel
        {
            Name = AdditionalFormFields.ProblemGroupType.ToString(),
            Options = EnumUtils.GetValuesFrom<ProblemGroupType>().Cast<object>(),
            Type = typeof(ProblemGroupType),
            Value = entity.ProblemGroup?.Type ?? default(ProblemGroupType),
        });

        formControls.Add(new FormControlViewModel
        {
            Name = this.GetComplexFormControlNameFor<Contest>(),
            Value = contestId,
            Type = typeof(int),
            IsReadOnly = true,
        });

        if (contest.IsOnlineExam)
        {
            var problemGroupFieldType = formControls.First(x => x.Name == AdditionalFormFields.ProblemGroupType.ToString());

            problemGroupFieldType.IsHidden = true;
        }
        else
        {
            var problemGroupField = formControls.First(x => x.Name == nameof(Data.Models.Problems.Problem.ProblemGroup));

            problemGroupField.IsHidden = true;
        }

        formControls.Add(new FormControlViewModel
        {
            Name = AdditionalFormFields.Tests.ToString(), Type = typeof(IFormFile),
        });

        formControls.Add(new FormControlViewModel
        {
            Name = AdditionalFormFields.AdditionalFiles.ToString(), Type = typeof(IFormFile),
        });

        var submissionTypesInProblem = await this.problemsData.GetByIdQuery(entity.Id)
            .SelectMany(p => p.SubmissionTypesInProblems)
            .ToListAsync();

        formControls.Add(new FormControlViewModel
        {
            Name = AdditionalFormFields.SubmissionTypes.ToString(),
            Options = this.submissionTypesData
                .GetQuery()
                .ToList()
                .Select(st => new ExpandableMultiChoiceCheckBoxFormControlViewModel
                {
                    Name = st.Name,
                    Value = st.Id,
                    IsChecked = submissionTypesInProblem.Any(x => x.SubmissionTypeId == st.Id),
                    Expand = new FormControlViewModel
                    {
                        Name = st.Name + " " + AdditionalFormFields.SolutionSkeletonRaw.ToString(),
                        Value = submissionTypesInProblem
                            .Where(x => x.SubmissionTypeId == st.Id)
                            .Select(x => x.SolutionSkeleton)
                            .FirstOrDefault()?.Decompress(),
                        Type = typeof(string),
                        FormControlType = FormControlType.TextArea,
                    },
                }),
            FormControlType = FormControlType.ExpandableMultiChoiceCheckBox,
            Type = typeof(object),
        });

        return formControls;
    }

    protected override async Task BeforeGeneratingForm(
        Problem entity,
        EntityAction action,
        IDictionary<string, string> entityDict)
    {
        entity.ProblemGroup = this.problemGroupsData.GetByProblem(entity.Id)!;
        await this.contestsValidationHelper
            .ValidatePermissionsOfCurrentUser(GetContestId(entity, entityDict))
            .VerifyResult();
    }

    protected override async Task BeforeEntitySaveAsync(Problem entity, AdminActionContext actionContext)
    {
        entity.ProblemGroup = this.problemGroupsData.GetByProblem(entity.Id)!;
        entity.SubmissionTypesInProblems = await this.problemsData.GetByIdQuery(entity.Id)
            .SelectMany(p => p.SubmissionTypesInProblems)
            .ToListAsync();

        await base.BeforeEntitySaveAsync(entity, actionContext);

        var contestId = GetContestId(entity, actionContext.EntityDict);

        await this.contestsValidationHelper
            .ValidatePermissionsOfCurrentUser(contestId)
            .VerifyResult();

        AddSubmissionTypes(entity, actionContext);
    }

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
        originalEntity.ProblemGroup = this.problemGroupsData.GetByProblem(originalEntity.Id)!;
        newEntity.ProblemGroup.Type = actionContext.GetProblemGroupType().GetValidTypeOrNull();

        if (!originalEntity.ProblemGroup.Contest.IsOnlineExam)
        {
            newEntity.ProblemGroup.OrderBy = newEntity.OrderBy;
        }

        await base.BeforeEntitySaveOnEditAsync(originalEntity, newEntity, actionContext);
    }

    protected override Task ModifyFormControls(
        ICollection<FormControlViewModel> formControls,
        Problem entity,
        EntityAction action,
        IDictionary<string, string> entityDict)
    {
        var contestId = GetContestId(entityDict, entity);

        if (contestId == default)
        {
            throw new Exception($"A valid ContestId must be provided to be able to {action} a Problem.");
        }

        var problemGroupInput = formControls.First(fc => fc.Name == nameof(ProblemGroup));

        var orderedProblemGroupsQuery = this.problemGroupsData.GetAllByContestId(contestId)
            .OrderBy(pg => pg.OrderBy);
        problemGroupInput.Options = orderedProblemGroupsQuery;

        return base.ModifyFormControls(formControls, entity, action, entityDict);
    }

    protected override async Task AfterEntitySaveAsync(Problem entity, AdminActionContext actionContext)
    {
        var contestId = GetContestId(actionContext.EntityDict, entity);

        if (entity.ProblemGroup == default)
        {
            var problemGroup = await this.problemGroupsData.GetAllByContestId(contestId)
                .Where(group => group.Problems.Any(problem => problem.Id == entity.Id))
                .FirstOrDefaultAsync();

            entity.ProblemGroup = problemGroup!;
        }

        await this.problemsBusiness.ReevaluateProblemsOrder(contestId, entity);
    }

    protected override async Task BeforeEntitySaveOnDeleteAsync(Problem entity, AdminActionContext actionContext)
    {
        var validationModel = new ContestDeleteProblemsValidationServiceModel
        {
            Id = entity.ProblemGroup.ContestId, IsActive = await this.contestsActivity.IsContestActive(entity.ProblemGroup.ContestId),
        };

        this.contestDeleteProblemsValidation
            .GetValidationResult(validationModel)
            .VerifyResult();
    }

    protected override Expression<Func<Problem, bool>> GetMasterGridFilter()
    {
        var filterExpressions = new List<Expression<Func<Problem, bool>>>();

        var filterByLecturerRightsExpression =
            this.lecturerContestPrivilegesBusiness.GetProblemsUserPrivilegesExpression(
                this.User.GetId(),
                this.User.IsAdmin());

        filterExpressions.Add(filterByLecturerRightsExpression);

        if (this.TryGetEntityIdForNumberColumnFilter(ContestIdKey, out var contestId))
        {
            filterExpressions.Add(p => p.ProblemGroup.ContestId == contestId);
        }

        if (this.TryGetEntityIdForStringColumnFilter(CheckerName, out var checkerName))
        {
            filterExpressions.Add(p => p.Checker != null && p.Checker.Name == checkerName);
        }

        return filterExpressions.CombineMultiple();
    }

    private static int GetContestId(IDictionary<string, string> entityDict, Problem? problem)
        => entityDict.GetEntityIdOrDefault<Contest>() ?? problem?.ProblemGroup?.ContestId ?? default;

    private static void AddSubmissionTypes(Problem problem, AdminActionContext actionContext)
    {
        var newSubmissionTypes = actionContext.GetSubmissionTypes()
            .Where(x => x.IsChecked)
            .Select(x => new SubmissionTypeInProblem
            {
                ProblemId = problem.Id,
                SubmissionTypeId = int.Parse(x.Value!.ToString()!),
                SolutionSkeleton = x.Expand != null
                    ? x.Expand!.Value!.ToString()!.Compress()
                    : Array.Empty<byte>(),
            });

        problem.SubmissionTypesInProblems = new HashSet<SubmissionTypeInProblem>(newSubmissionTypes);
    }

    private static int GetContestId(Problem entity, IDictionary<string, string> entityDict)
        => entityDict.GetEntityIdOrDefault<Contest>() ?? entity.ProblemGroup?.ContestId ?? default;

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
            throw new Exception(string.Format(GlobalResource.TestsCannotBeImprorted, ex.Message), ex);
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
            throw new ArgumentException(GlobalResource.InvalidTests);
        }

        this.zippedTestsParser.AddTestsToProblem(problem, parsedTests);
    }

    private async Task PrepareViewModelForCopyAll(CopyAllToAnotherContestViewModel model, int fromContestId)
    {
        model.FromContestId = fromContestId;
        model.Name = await this.contestsData.GetNameById(fromContestId);
        model.ContestsToCopyTo = await this.GetContestsToCopyToSelectList();
    }

    private async Task PrepareViewModelForCopy(CopyToAnotherContestViewModel model)
        => model.ContestsToCopyTo = await this.GetContestsToCopyToSelectList();

    private async Task<SelectList> GetContestsToCopyToSelectList()
    {
        //used by the new administration.
        var contestsToCopyTo =
            await this.contestsBusiness.GetAllAvailableForCurrentUser<ContestCopyProblemsValidationServiceModel>("test");

        return new SelectList(contestsToCopyTo, nameof(Contest.Id), nameof(Contest.Name));
    }

    private IEnumerable<AutoCrudAdminGridToolbarActionViewModel> GetCustomToolbarActions(int contestId)
    {
        var routeValues = new Dictionary<string, string> { { nameof(contestId), contestId.ToString() }, };

        return new AutoCrudAdminGridToolbarActionViewModel[]
        {
            new() { Name = "Add new", Action = nameof(this.Create), RouteValues = routeValues, },
            new() { Name = "Delete all", Action = nameof(this.DeleteAll), RouteValues = routeValues, },
            new() { Name = "Copy all", Action = nameof(this.CopyAll), RouteValues = routeValues, },
        };
    }
}