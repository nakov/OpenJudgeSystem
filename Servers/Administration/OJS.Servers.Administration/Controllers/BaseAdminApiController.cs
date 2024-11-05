namespace OJS.Servers.Administration.Controllers;

using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OJS.Common;
using OJS.Common.Enumerations;
using OJS.Common.Extensions;
using OJS.Servers.Administration.Attributes;
using OJS.Servers.Administration.Filters;
using OJS.Servers.Infrastructure.Controllers;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Data;
using OJS.Services.Common.Models;
using OJS.Services.Common.Models.Pagination;
using OJS.Services.Common.Models.Users;
using OJS.Services.Infrastructure.Extensions;
using OJS.Data.Models.Common;
using System.Threading.Tasks;
using static OJS.Services.Administration.Models.AdministrationConstants;
using static Common.GlobalConstants.FileExtensions;

[Authorize(Roles = GlobalConstants.Roles.AdministratorOrLecturer)]
[TypeFilter(typeof(EntityPermissionsFilter))]
public abstract class BaseAdminApiController<TEntity, TId, TGridModel, TUpdateModel> : BaseApiController
    where TEntity : class, IEntity<TId>
    where TUpdateModel : BaseAdministrationModel<TId>, new()
{
    private readonly IGridDataService<TEntity> gridDataService;
    private readonly IAdministrationOperationService<TEntity, TId, TUpdateModel> operationService;
    private readonly IValidator<TUpdateModel> validator;

    protected BaseAdminApiController(
        IGridDataService<TEntity> gridDataService,
        IAdministrationOperationService<TEntity, TId, TUpdateModel> operationService,
        IValidator<TUpdateModel> validator)
    {
        this.gridDataService = gridDataService;
        this.operationService = operationService;
        this.validator = validator;
    }

    [HttpGet]
    [ProtectedEntityAction(false)]
    public virtual async Task<IActionResult> GetAll([FromQuery]PaginationRequestModel model)
    {
        var user = this.User.Map<UserInfoModel>();

        if (!await this.gridDataService.UserHasAccessToGrid(user))
        {
            return this.Unauthorized();
        }

        return this.Ok(await this.gridDataService.GetAllForUser<TGridModel>(model, user));
    }

    [HttpGet]
    [ProtectedEntityAction(false)]
    public virtual async Task<IActionResult> GetExcelFile([FromQuery]PaginationRequestModel model)
    {
        var user = this.User.Map<UserInfoModel>();

        if (!await this.gridDataService.UserHasAccessToGrid(user))
        {
            return this.Unauthorized();
        }

        var file = await this.gridDataService.GetExcelResultsForUser<TGridModel>(model, user);
        return this.File(file.Content!, file.MimeType!, $"{typeof(TEntity).Name}{Excel}");
    }

    // TODO: use nameof(id) for the argument name in the attribute when upgraded to .NET 7 or above.
    [HttpGet("{id}")]
    [ProtectedEntityAction("id", AdministrationOperations.Read)]
    public virtual async Task<IActionResult> Get(TId id)
    {
        var validationResult = await this.validator
            .ValidateAsync(new TUpdateModel { Id = id, OperationType = CrudOperationType.Read })
            .ToExceptionResponseAsync();

        if (!validationResult.IsValid)
        {
            return this.UnprocessableEntity(validationResult.Errors);
        }

        var result = await this.operationService.Get(id);
        return this.Ok(result);
    }

    [HttpPost]
    [ProtectedEntityAction("model", AdministrationOperations.Create)]
    public virtual async Task<IActionResult> Create([FromBody] TUpdateModel model)
    {
        model.OperationType = CrudOperationType.Create;
        var validationResult = await this.validator.ValidateAsync(model).ToExceptionResponseAsync();

        if (!validationResult.IsValid)
        {
            return this.UnprocessableEntity(validationResult.Errors);
        }

        await this.operationService.Create(model);
        return this.Ok($"The {typeof(TEntity).Name} was successfully created.");
    }

    [HttpPatch]
    [ProtectedEntityAction("model", AdministrationOperations.Update)]
    public virtual async Task<IActionResult> Edit([FromBody] TUpdateModel model)
    {
        model.OperationType = CrudOperationType.Update;
        var validationResult = await this.validator.ValidateAsync(model).ToExceptionResponseAsync();

        if (!validationResult.IsValid)
        {
            return this.UnprocessableEntity(validationResult.Errors);
        }

        await this.operationService.Edit(model);
        return this.Ok($"The {typeof(TEntity).Name} was successfully updated.");
    }

    [HttpDelete("{id}")]
    [ProtectedEntityAction("id", AdministrationOperations.Delete)]
    public virtual async Task<IActionResult> Delete(TId id)
    {
        var validationResult = await this.validator
            .ValidateAsync(new TUpdateModel { Id = id, OperationType = CrudOperationType.Delete })
            .ToExceptionResponseAsync();

        if (!validationResult.IsValid)
        {
            return this.UnprocessableEntity(validationResult.Errors);
        }

        await this.operationService.Delete(id);
        return this.Ok($"Successfully deleted {typeof(TEntity).Name} with id: {id}");
    }
}