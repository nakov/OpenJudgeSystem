namespace OJS.Servers.Administration.Controllers;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using AutoCrudAdmin.Extensions;
using AutoCrudAdmin.Models;
using AutoCrudAdmin.ViewModels;
using FluentExtensions.Extensions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using OJS.Data.Models.Problems;
using OJS.Servers.Infrastructure.Extensions;
using OJS.Services.Administration.Business.Extensions;
using OJS.Services.Administration.Business.Validation.Factories;
using OJS.Services.Administration.Business.Validation.Helpers;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models;
using OJS.Services.Administration.Models.ProblemResources;
using OJS.Services.Administration.Business;
using OJS.Services.Common.Validation;
using OJS.Services.Infrastructure.Extensions;
using OJS.Common.Extensions;

public class ProblemResourcesController : BaseAutoCrudAdminController<ProblemResource>
{
    public const string ProblemIdKey = nameof(ProblemResource.ProblemId);
    private const string ProblemName = nameof(ProblemResource.Problem);

    private readonly ILecturerContestPrivilegesBusinessService lecturerContestPrivilegesBusinessService;
    private readonly IValidatorsFactory<ProblemResource> problemResourceValidatorsFactory;
    private readonly IProblemResourcesDataService problemResourcesData;
    private readonly IOrderableService<ProblemResource> problemResourcesOrderableService;
    private readonly IValidationService<ProblemResourceDownloadServiceModel> problemResourcesDownloadValidation;
    private readonly IContentTypesService contentTypes;
    private readonly IProblemsValidationHelper problemsValidationHelper;

    public ProblemResourcesController(
        IValidatorsFactory<ProblemResource> problemResourceValidatorsFactory,
        IProblemResourcesDataService problemResourcesData,
        IValidationService<ProblemResourceDownloadServiceModel> problemResourcesDownloadValidation,
        IContentTypesService contentTypes,
        IProblemsValidationHelper problemsValidationHelper,
        IOrderableService<ProblemResource> problemResourcesOrderableService,
        ILecturerContestPrivilegesBusinessService lecturerContestPrivilegesBusinessService,
        IOptions<ApplicationConfig> appConfigOptions)
        : base(appConfigOptions)
    {
        this.problemResourceValidatorsFactory = problemResourceValidatorsFactory;
        this.problemResourcesData = problemResourcesData;
        this.problemResourcesDownloadValidation = problemResourcesDownloadValidation;
        this.contentTypes = contentTypes;
        this.problemsValidationHelper = problemsValidationHelper;
        this.problemResourcesOrderableService = problemResourcesOrderableService;
        this.lecturerContestPrivilegesBusinessService = lecturerContestPrivilegesBusinessService;
    }

    protected override Expression<Func<ProblemResource, bool>>? MasterGridFilter
        => this.GetMasterGridFilter();

    protected override IEnumerable<AutoCrudAdminGridToolbarActionViewModel> CustomToolbarActions
        => this.TryGetEntityIdForNumberColumnFilter(ProblemIdKey, out var problemId)
            ? this.GetCustomToolbarActions(problemId)
            : base.CustomToolbarActions;

    protected override IEnumerable<Func<ProblemResource, ProblemResource, AdminActionContext, ValidatorResult>>
        EntityValidators
        => this.problemResourceValidatorsFactory.GetValidators();

    protected override IEnumerable<Func<ProblemResource, ProblemResource, AdminActionContext, Task<ValidatorResult>>>
        AsyncEntityValidators
        => this.problemResourceValidatorsFactory.GetAsyncValidators();

    protected override IEnumerable<GridAction> CustomActions
        => new[] { new GridAction { Action = nameof(this.Download) }, };

    public override Task<IActionResult> Create(IDictionary<string, string> complexId, string? postEndpointName)
        => base.Create(complexId, nameof(this.Create));

    [HttpPost]
    public Task<IActionResult> Create(IDictionary<string, string> entityDict, IFormFile file)
        => this.PostCreate(entityDict, new FormFilesContainer(file));

    public override Task<IActionResult> Edit(IDictionary<string, string> complexId, string? postEndpointName)
        => base.Edit(complexId, nameof(this.Edit));

    [HttpPost]
    public Task<IActionResult> Edit(IDictionary<string, string> entityDict, IFormFile file)
        => this.PostEdit(entityDict, new FormFilesContainer(file));

    public async Task<IActionResult> Download([FromQuery] IDictionary<string, string> complexId)
    {
        var id = this.GetEntityIdFromQuery<int>(complexId);

        var resource = await this.problemResourcesData.OneByIdTo<ProblemResourceDownloadServiceModel>(id);

        this.problemResourcesDownloadValidation
            .GetValidationResult(resource)
            .VerifyResult();

        await this.problemsValidationHelper
            .ValidatePermissionsOfCurrentUser(resource!.ProblemId)
            .VerifyResult();

        var file = resource.File;

        if (file == null)
        {
            return this.NotFound();
        }

        var contentType = this.contentTypes.GetByFileExtension(resource.FileExtension);
        var fileName = GetResourceFileNameForDownload(resource);

        return this.File(file, contentType, fileName);
    }

    protected override object GetDefaultRouteValuesForPostEntityFormRedirect(
        ProblemResource newEntity)
        => new Dictionary<string, string> { { ProblemIdKey, newEntity.ProblemId.ToString() }, };

    protected override async Task<IEnumerable<FormControlViewModel>> GenerateFormControlsAsync(
        ProblemResource entity,
        EntityAction action,
        IDictionary<string, string> entityDict,
        IDictionary<string, Expression<Func<object, bool>>> complexOptionFilters,
        Type? autocompleteType)
    {
        var formControls = await base.GenerateFormControlsAsync(entity, action, entityDict, complexOptionFilters, autocompleteType)
            .ToListAsync();
        await this.ModifyFormControls(formControls, entity, action, entityDict);
        formControls.AddRange(GetAdditionalFormControls());
        return formControls;
    }

    protected override async Task BeforeGeneratingForm(ProblemResource entity, EntityAction action, IDictionary<string, string> entityDict)
    {
        if (entity.ProblemId != default)
        {
            await this.problemsValidationHelper
                .ValidatePermissionsOfCurrentUser(entity.ProblemId)
                .VerifyResult();
        }
    }

    protected override async Task BeforeEntitySaveAsync(ProblemResource entity, AdminActionContext actionContext)
    {
        await base.BeforeEntitySaveAsync(entity, actionContext);

        await this.problemsValidationHelper
            .ValidatePermissionsOfCurrentUser(entity.ProblemId)
            .VerifyResult();

        var file = actionContext.Files.SingleFiles.FirstOrDefault();
        if (file != null)
        {
            entity.File = await file.ToByteArray();
        }
    }

    protected override async Task BeforeEntitySaveOnEditAsync(
        ProblemResource existingEntity,
        ProblemResource newEntity,
        AdminActionContext actionContext)
    {
        if (existingEntity.ProblemId != newEntity.ProblemId)
        {
            await this.problemsValidationHelper
                .ValidatePermissionsOfCurrentUser(existingEntity.ProblemId)
                .VerifyResult();
        }
    }

    protected override async Task ModifyFormControls(
        ICollection<FormControlViewModel> formControls,
        ProblemResource entity,
        EntityAction action,
        IDictionary<string, string> entityDict)
    {
        var problemId = entityDict.GetEntityIdOrDefault<Problem>() ?? entity.ProblemId;

        if (problemId == default)
        {
            throw new Exception($"A valid ProblemId must be provided to be able to {action} a Problem Resource.");
        }

        var problemInput = formControls.First(fc => fc.Name == nameof(ProblemResource.Problem));
        problemInput.Value = problemId;
        problemInput.IsReadOnly = true;

        if (action == EntityAction.Create)
        {
            var orderByInput = formControls.First(fc => fc.Name == nameof(ProblemResource.OrderBy));
            orderByInput.Value = await this.GetNewOrderBy(problemId);
        }
    }

    protected override async Task AfterEntitySaveAsync(ProblemResource entity, AdminActionContext actionContext)
    {
        var problemId = actionContext.GetEntityIdOrDefault<Problem>() ?? entity.ProblemId;

        var problemResources = await this.problemResourcesData.GetByProblemQuery(problemId)
                                                            .ToListAsync();

        await this.problemResourcesOrderableService.ReevaluateOrder(problemResources);
    }

    protected override Expression<Func<ProblemResource, bool>> GetMasterGridFilter()
    {
        var filterExpressions = new List<Expression<Func<ProblemResource, bool>>>();

        Expression<Func<ProblemResource, bool>> filterByLecturerRightsExpression =
            this.lecturerContestPrivilegesBusinessService.GetProblemResourcesUserPrivilegesExpression(
                this.User.GetId(),
                this.User.IsAdmin());

        filterExpressions.Add(filterByLecturerRightsExpression);

        if (this.TryGetEntityIdForNumberColumnFilter(ProblemIdKey, out var problemId))
        {
            filterExpressions.Add(ps => ps.ProblemId == problemId);
        }

        if (this.TryGetEntityIdForStringColumnFilter(ProblemName, out var problemName))
        {
            filterExpressions.Add(pr => pr.Problem.Name == problemName);
        }

        return filterExpressions.CombineMultiple();
    }

    private static IEnumerable<FormControlViewModel> GetAdditionalFormControls()
        => new List<FormControlViewModel>
        {
            new() { Name = AdditionalFormFields.File.ToString(), Type = typeof(IFormFile), },
        };

    private static string GetResourceFileNameForDownload(ProblemResourceDownloadServiceModel resource)
    {
        var problemName = resource.ProblemName.Replace(" ", string.Empty);
        return $"Resource-{resource.Id}-{problemName}.{resource.FileExtension}";
    }

    private async Task<int> GetNewOrderBy(int problemId)
    {
        var resourcesForProblemOrderBys = await this.problemResourcesData.GetByProblemQuery(problemId)
            .Where(x => !x.IsDeleted)
            .Select(x => x.OrderBy)
            .ToListAsync();

        if (!resourcesForProblemOrderBys.Any())
        {
            return 1;
        }

        return (int)Math.Ceiling(resourcesForProblemOrderBys.Max()) + 1;
    }

    private IEnumerable<AutoCrudAdminGridToolbarActionViewModel> GetCustomToolbarActions(int problemId)
    {
        var routeValues = new Dictionary<string, string> { { nameof(problemId), problemId.ToString() }, };

        return new AutoCrudAdminGridToolbarActionViewModel[]
        {
            new() { Name = "Add new", Action = nameof(this.Create), RouteValues = routeValues, },
        };
    }
}
