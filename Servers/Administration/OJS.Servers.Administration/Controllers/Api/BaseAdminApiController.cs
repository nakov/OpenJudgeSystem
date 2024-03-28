namespace OJS.Servers.Administration.Controllers.Api;

using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using OJS.Servers.Infrastructure.Controllers;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Models.Validation;
using OJS.Services.Common.Models.Pagination;
using SoftUni.Data.Infrastructure.Models;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using OJS.Common;
using OJS.Common.Extensions;
using OJS.Servers.Administration.Attributes;
using OJS.Servers.Administration.Filters;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models;
using OJS.Services.Common.Models.Users;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using static OJS.Services.Administration.Models.AdministrationConstants;

[Authorize(Roles = GlobalConstants.Roles.AdministratorOrLecturer)]
[TypeFilter(typeof(EntityPermissionsFilter))]
public abstract class BaseAdminApiController<TEntity, TId, TGridModel, TUpdateModel> : BaseApiController
    where TEntity : class, IEntity<TId>
    where TUpdateModel : BaseAdministrationModel<TId>
{
    private readonly IGridDataService<TEntity> gridDataService;
    private readonly IAdministrationOperationService<TEntity, TId, TUpdateModel> operationService;
    private readonly IValidator<TUpdateModel> validator;
    private readonly IValidator<BaseDeleteValidationModel<TId>> deleteValidator;

    protected BaseAdminApiController(
        IGridDataService<TEntity> gridDataService,
        IAdministrationOperationService<TEntity, TId, TUpdateModel> operationService,
        IValidator<TUpdateModel> validator,
        IValidator<BaseDeleteValidationModel<TId>> deleteValidator)
    {
        this.gridDataService = gridDataService;
        this.operationService = operationService;
        this.validator = validator;
        this.deleteValidator = deleteValidator;
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
    public virtual async Task<IActionResult> GetExcelResults([FromQuery]PaginationRequestModel model)
    {
        var user = this.User.Map<UserInfoModel>();

        if (!await this.gridDataService.UserHasAccessToGrid(user))
        {
            return this.Unauthorized();
        }

        var file = await this.gridDataService.GetExcelResultsForUser<TGridModel>(model, user);
        return this.File(file.Content!, file.MimeType!, $"{typeof(TEntity).Name}.xls");
    }

    // TODO: use nameof(id) for the argument name in the attribute when upgraded to .NET 7 or above.
    [HttpGet("{id}")]
    [ProtectedEntityAction("id", AdministrationOperations.Read)]
    public virtual async Task<IActionResult> Get(TId id)
    {
        var result = await this.operationService.Get(id);
        return this.Ok(result);
    }

    [HttpPost]
    [ProtectedEntityAction("model", AdministrationOperations.Create)]
    public virtual async Task<IActionResult> Create([FromBody] TUpdateModel model)
    {
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
        var validationResult =
            await this.deleteValidator
                .ValidateAsync(new BaseDeleteValidationModel<TId> { Id = id })
                .ToExceptionResponseAsync();

        if (!validationResult.IsValid)
        {
            return this.UnprocessableEntity(validationResult.Errors);
        }

        await this.operationService.Delete(id);
        return this.Ok($"Successfully deleted {typeof(TEntity).Name} with id: {id}");
    }
}