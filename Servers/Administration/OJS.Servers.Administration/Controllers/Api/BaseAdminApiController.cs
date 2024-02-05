namespace OJS.Servers.Administration.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using OJS.Servers.Infrastructure.Controllers;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Models.Validation;
using OJS.Services.Common.Data.Pagination;
using OJS.Services.Common.Models.Pagination;
using OJS.Services.Common.Validation;
using SoftUni.Common.Models;
using SoftUni.Data.Infrastructure.Models;
using System;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using OJS.Common;

[Authorize(Roles = GlobalConstants.Roles.AdministratorOrLecturer)]
public abstract class BaseAdminApiController<TEntity, TGridModel, TUpdateModel> : BaseApiController
    where TEntity : class, IEntity
    where TUpdateModel : class
{
    private readonly IGridDataService<TEntity> gridDataService;
    private readonly IAdministrationOperationService<TEntity, TUpdateModel> operationService;
    private readonly BaseValidator<TUpdateModel> validator;
    private readonly BaseDeleteValidator<BaseDeleteValidationModel> deleteValidator;
    private readonly IPermissionsService<TUpdateModel> permissionsService;

    protected BaseAdminApiController(
        IGridDataService<TEntity> gridDataService,
        IAdministrationOperationService<TEntity, TUpdateModel> operationService,
        BaseValidator<TUpdateModel> validator,
        BaseDeleteValidator<BaseDeleteValidationModel> deleteValidator,
        IPermissionsService<TUpdateModel> permissionsService)
    {
        this.gridDataService = gridDataService;
        this.operationService = operationService;
        this.validator = validator;
        this.deleteValidator = deleteValidator;
        this.permissionsService = permissionsService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery]PaginationRequestModel model)
    {
        if (!this.permissionsService.HasReadPermission())
        {
            return this.Unauthorized();
        }

        var contest = await this.gridDataService.GetAll<TGridModel>(model);
        return this.Ok(contest);
    }

    [HttpGet("{id:int}")]
    public virtual async Task<IActionResult> Get(int id)
    {
        if (!this.permissionsService.HasReadPermission())
        {
            return this.Unauthorized();
        }

        var result = await this.operationService.Get(id);
        return this.Ok(result);
    }

    [HttpPost]
    public virtual async Task<IActionResult> Create(TUpdateModel model)
    {
        if (!this.permissionsService.HasCreatePermission())
        {
            return this.Unauthorized();
        }

        var validationResult = await this.validator.ExecuteValidation(model);

        if (!validationResult.IsValid)
        {
            return this.UnprocessableEntity(validationResult.Errors);
        }

        await this.operationService.Create(model);
        return this.Ok($"The {typeof(TEntity).Name} was successfully created.");
    }

    [HttpPatch]
    public virtual async Task<IActionResult> Edit(TUpdateModel model)
    {
        if (!this.permissionsService.HasUpdatePermission(model))
        {
            return this.Unauthorized();
        }

        var validationResult = await this.validator.ExecuteValidation(model);

        if (!validationResult.IsValid)
        {
            return this.UnprocessableEntity(validationResult.Errors);
        }

        await this.operationService.Edit(model);
        return this.Ok($"The {typeof(TEntity).Name} was successfully updated.");
    }

    [HttpDelete("{id:int}")]
    public virtual async Task<IActionResult> Delete(int id)
    {
        if (!this.permissionsService.HasDeletePermission(id))
        {
            return this.Unauthorized();
        }

        var validationResult =
            await this.deleteValidator.ExecuteValidation(new BaseDeleteValidationModel { Id = id });

        if (!validationResult.IsValid)
        {
            return this.UnprocessableEntity(validationResult.Errors);
        }

        await this.operationService.Delete(id);
        return this.Ok($"Successfully deleted {typeof(TEntity).Name} with id: {id}");
    }

    protected async Task<PagedResult<T>> GetWithFilter<T>(PaginationRequestModel model,  Expression<Func<TEntity, bool>> filter)
        => await this.gridDataService.GetAll<T>(model, filter);
}