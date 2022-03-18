namespace OJS.Servers.Administration.Controllers;

using AutoCrudAdmin.Extensions;
using AutoCrudAdmin.Models;
using AutoCrudAdmin.ViewModels;
using FluentExtensions.Extensions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OJS.Data.Models.Problems;
using OJS.Servers.Infrastructure.Extensions;
using OJS.Services.Administration.Business.Extensions;
using OJS.Services.Administration.Business.Validation;
using OJS.Services.Administration.Business.Validation.Factories;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models;
using OJS.Services.Administration.Models.ProblemResources;
using OJS.Services.Common;
using OJS.Services.Infrastructure.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

public class ProblemResourcesController : BaseAutoCrudAdminController<ProblemResource>
{
    private const string ProblemIdKey = nameof(ProblemResource.ProblemId);

    private readonly IProblemResourceValidatorsFactory problemResourceValidatorsFactory;
    private readonly IProblemResourcesDataService problemResourcesData;
    private readonly IProblemResourcesDownloadValidationService problemResourcesDownloadValidation;
    private readonly IContentTypesService contentTypes;

    public ProblemResourcesController(
        IProblemResourceValidatorsFactory problemResourceValidatorsFactory,
        IProblemResourcesDataService problemResourcesData,
        IProblemResourcesDownloadValidationService problemResourcesDownloadValidation,
        IContentTypesService contentTypes)
    {
        this.problemResourceValidatorsFactory = problemResourceValidatorsFactory;
        this.problemResourcesData = problemResourcesData;
        this.problemResourcesDownloadValidation = problemResourcesDownloadValidation;
        this.contentTypes = contentTypes;
    }

    public override IActionResult Index()
    {
        if (!this.TryGetEntityIdForColumnFilter(ProblemIdKey, out var problemId))
        {
            return base.Index();
        }

        var routeValues = new Dictionary<string, string>
        {
            { nameof(problemId), problemId.ToString() },
        };

        this.MasterGridFilter = pr => pr.ProblemId == problemId;
        this.CustomToolbarActions = new AutoCrudAdminGridToolbarActionViewModel[]
        {
            new()
            {
                Name = "Add new",
                Action = nameof(this.Create),
                RouteValues = routeValues,
            },
        };

        return base.Index();
    }

    public override Task<IActionResult> Create(IDictionary<string, string> complexId, string postEndpointName)
        => base.Create(complexId, nameof(Create));

    [HttpPost]
    public Task<IActionResult> Create(IDictionary<string, string> entityDict, IFormFile file)
        => base.PostCreate(entityDict, new FormFilesContainer(file));

    public override Task<IActionResult> Edit(IDictionary<string, string> complexId, string postEndpointName)
        => base.Edit(complexId, nameof(Edit));

    [HttpPost]
    public Task<IActionResult> Edit(IDictionary<string, string> entityDict, IFormFile file)
        => base.PostEdit(entityDict, new FormFilesContainer(file));

    public async Task<IActionResult> Download([FromQuery] IDictionary<string, string> complexId)
    {
        var id = this.GetEntityIdFromQuery(complexId);

        var resource = await this.problemResourcesData.OneByIdTo<ProblemResourceDownloadServiceModel>(id);

        await this.problemResourcesDownloadValidation
            .GetValidationResult(resource)
            .VerifyResult();

        var file = resource?.File;

        if (file == null)
        {
            return this.NotFound();
        }

        var contentType = this.contentTypes.GetByFileExtension(resource!.FileExtension);
        var fileName = $"Resource-{resource.Id}-{resource.ProblemName.Replace(" ", string.Empty)}.{resource.FileExtension}";

        return this.File(file, contentType, fileName);
    }

    protected override IEnumerable<Func<ProblemResource, ProblemResource, AdminActionContext, ValidatorResult>>
        EntityValidators
        => this.problemResourceValidatorsFactory.GetValidators();

    protected override IEnumerable<Func<ProblemResource, ProblemResource, AdminActionContext, Task<ValidatorResult>>>
        AsyncEntityValidators
        => this.problemResourceValidatorsFactory.GetAsyncValidators();

    protected override IEnumerable<GridAction> CustomActions
        => new[]
        {
            new GridAction { Action = nameof(Download) }
        };

    protected override object GetDefaultRouteValuesForPostEntityFormRedirect(
        ProblemResource newEntity)
        => new Dictionary<string, string>
        {
            { ProblemIdKey, newEntity.ProblemId.ToString() },
        };

    protected override async Task<IEnumerable<FormControlViewModel>> GenerateFormControlsAsync(
        ProblemResource entity,
        EntityAction action,
        IDictionary<string, string> entityDict,
        IDictionary<string, Expression<Func<object, bool>>> complexOptionFilters)
    {
        var formControls = await base.GenerateFormControlsAsync(entity, action, entityDict, complexOptionFilters)
            .ToListAsync();

        var problemId = entityDict.TryGetEntityId<Problem>();

        if (problemId == null)
        {
            throw new Exception($"A valid ProblemId must be provided to be able to {action} a Problem Resource.");
        }

        var problemInput = formControls.First(fc => fc.Name == nameof(ProblemResource.Problem));
        problemInput.Value = problemId;
        problemInput.IsReadOnly = true;

        var orderByInput = formControls.First(fc => fc.Name == nameof(entity.OrderBy));
        orderByInput.Value = await this.GetNewOrderBy(problemId.Value);

        formControls.Add(new FormControlViewModel
        {
            Name = AdditionalFormFields.File.ToString(),
            Type = typeof(IFormFile),
        });

        return formControls;
    }

    protected override async Task BeforeEntitySaveAsync(ProblemResource entity, AdminActionContext actionContext)
    {
        var file = actionContext.Files.SingleFiles.FirstOrDefault();
        if (file != null)
        {
            entity.File = await file.ToByteArray();
        }
    }

    private async Task<int> GetNewOrderBy(int problemId)
    {
        var resourcesForProblem = await this.problemResourcesData.GetByProblemQuery(problemId)
            .Where(x => !x.IsDeleted)
            .Select(x => x.OrderBy)
            .ToListAsync();

        if (!resourcesForProblem.Any())
        {
            return 0;
        }

        return (int)Math.Ceiling(resourcesForProblem.Max()) + 1;
    }
}