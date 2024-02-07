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
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models;
using OJS.Services.Common.Models.Users;
using SoftUni.AutoMapper.Infrastructure.Extensions;

[Authorize(Roles = GlobalConstants.Roles.AdministratorOrLecturer)]
public abstract class BaseAdminApiController<TEntity, TId, TGridModel, TUpdateModel> : BaseApiController
    where TEntity : class, IEntity<TId>
    where TUpdateModel : BaseAdministrationModel<TId>
    where TId : notnull
{
    private readonly IGridDataService<TEntity> gridDataService;
    private readonly IAdministrationOperationService<TEntity, TId, TUpdateModel> operationService;
    private readonly IValidator<TUpdateModel> validator;
    private readonly IValidator<BaseDeleteValidationModel<TId>> deleteValidator;
    private readonly IPermissionsService<TUpdateModel, TId> permissionsService;

    protected BaseAdminApiController(
        IGridDataService<TEntity> gridDataService,
        IAdministrationOperationService<TEntity, TId, TUpdateModel> operationService,
        IValidator<TUpdateModel> validator,
        IValidator<BaseDeleteValidationModel<TId>> deleteValidator,
        IPermissionsService<TUpdateModel, TId> permissionsService)
    {
        this.gridDataService = gridDataService;
        this.operationService = operationService;
        this.validator = validator;
        this.deleteValidator = deleteValidator;
        this.permissionsService = permissionsService;
    }

    [HttpGet]
    public virtual async Task<IActionResult> GetAll([FromQuery]PaginationRequestModel model)
    {
        var user = this.User.Map<UserInfoModel>();

        if (!await this.gridDataService.UserHasAccessToGrid(user))
        {
            return this.Unauthorized();
        }

        return this.Ok(await this.gridDataService.GetAllForUser<TGridModel>(model, user));
    }

    [HttpGet("{id}")]
    public virtual async Task<IActionResult> Get(TId id)
    {
        var entityPermissions = await this.permissionsService.GetPermissions(this.User.Map<UserInfoModel>(), id);

        if (!entityPermissions.CanRead)
        {
            return this.Unauthorized();
        }

        var result = await this.operationService.Get(id);
        return this.Ok(result);
    }

    [HttpPost]
    public virtual async Task<IActionResult> Create(TUpdateModel model)
    {
        var entityPermissions = await this.permissionsService.GetPermissions(this.User.Map<UserInfoModel>(), model);

        if (!entityPermissions.CanCreate)
        {
            return this.Unauthorized();
        }

        var validationResult = await this.validator.ValidateAsync(model).ToExceptionResponseAsync();

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
        var entityPermissions = await this.permissionsService.GetPermissions(this.User.Map<UserInfoModel>(), model.Id!);

        if (!entityPermissions.CanEdit)
        {
            return this.Unauthorized();
        }

        var validationResult = await this.validator.ValidateAsync(model).ToExceptionResponseAsync();

        if (!validationResult.IsValid)
        {
            return this.UnprocessableEntity(validationResult.Errors);
        }

        await this.operationService.Edit(model);
        return this.Ok($"The {typeof(TEntity).Name} was successfully updated.");
    }

    [HttpDelete("{id}")]
    public virtual async Task<IActionResult> Delete(TId id)
    {
        var entityPermissions = await this.permissionsService.GetPermissions(this.User.Map<UserInfoModel>(), id);

        if (!entityPermissions.CanDelete)
        {
            return this.Unauthorized();
        }

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