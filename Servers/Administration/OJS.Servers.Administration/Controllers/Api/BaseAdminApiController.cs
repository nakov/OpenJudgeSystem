namespace OJS.Servers.Administration.Controllers.Api;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OJS.Common;
using OJS.Servers.Infrastructure.Controllers;
using OJS.Services.Common.Data.Pagination;
using OJS.Services.Common.Models.Pagination;
using SoftUni.Data.Infrastructure.Models;
using System;
using System.Linq.Expressions;
using System.Threading.Tasks;
using SoftUni.Common.Models;
using OJS.Services.Administration.Business;
using OJS.Services.Common.Validation;
using System.Linq;

public abstract class BaseAdminApiController<TEntity, TGridModel, TUpdateModel> : BaseApiController
    where TEntity : class, IEntity
    where TUpdateModel : class
{
    private readonly IGridDataService<TEntity> gridDataService;
    private readonly IAdministrationOperationService<TEntity, TUpdateModel> operationService;
    private readonly BaseValidator<TUpdateModel> validator;

    protected BaseAdminApiController(
        IGridDataService<TEntity> gridDataService,
        IAdministrationOperationService<TEntity, TUpdateModel> operationService,
        BaseValidator<TUpdateModel> validator)
    {
        this.gridDataService = gridDataService;
        this.operationService = operationService;
        this.validator = validator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery]PaginationRequestModel model)
    {
        var contest = await this.gridDataService.GetAll<TGridModel>(model);
        return this.Ok(contest);
    }

    [HttpGet("{id:int}")]
    public virtual async Task<IActionResult> Get(int id)
    {
        var result = await this.operationService.Get(id);
        return this.Ok(result);
    }

    [HttpPost]
    public virtual async Task<IActionResult> Create(TUpdateModel model)
    {
        var validations = this.validator.ProcessValidationResult(await this.validator.ValidateAsync(model));

        if (validations.Errors.Any())
        {
            return this.UnprocessableEntity(validations.Errors);
        }

        await this.operationService.Create(model);
        return this.Ok($"The {typeof(TEntity).Name} was successfully created.");
    }

    [HttpPatch]
    public virtual async Task<IActionResult> Edit(TUpdateModel model)
    {
        var validations = this.validator.ProcessValidationResult(await this.validator.ValidateAsync(model));

        if (validations.Errors.Any())
        {
            return this.UnprocessableEntity(validations.Errors);
        }

        await this.operationService.Edit(model);
        return this.Ok($"The {typeof(TEntity).Name} was successfully updated.");
    }

    [HttpDelete("{id:int}")]
    public virtual async Task<IActionResult> Delete(int id)
    {
        if (id <= 0)
        {
            return this.UnprocessableEntity("Invalid contest id.");
        }

        await this.operationService.Delete(id);
        return this.Ok($"Successfully deleted {typeof(TEntity).Name} with id: {id}");
    }

    protected async Task<PagedResult<T>> GetWithFilter<T>(PaginationRequestModel model,  Expression<Func<TEntity, bool>> filter)
        => await this.gridDataService.GetAll<T>(model, filter);
}