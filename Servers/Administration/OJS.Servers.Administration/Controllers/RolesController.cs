﻿namespace OJS.Servers.Administration.Controllers;

using Microsoft.AspNetCore.Mvc;
using OJS.Common.Enumerations;
using OJS.Common.Extensions;
using OJS.Data.Models.Users;
using OJS.Servers.Administration.Attributes;
using OJS.Servers.Infrastructure.Extensions;
using OJS.Services.Administration.Business.Roles;
using OJS.Services.Administration.Business.Roles.GridData;
using OJS.Services.Administration.Business.Roles.Permissions;
using OJS.Services.Administration.Business.Roles.Validators;
using OJS.Services.Administration.Models.Roles;
using System.Threading.Tasks;
using OJS.Data.Models;
using OJS.Services.Common.Data;

public class RolesController : BaseAdminApiController<Role, string, RoleInListModel, RoleAdministrationModel>
{
    private readonly IRolesBusinessService rolesBusinessService;
    private readonly UserToRoleModelValidator userToRoleModelValidator;

    public RolesController(
       IRoleGridDataService gridDataService,
       IRolesBusinessService rolesBusinessService,
       RoleAdministrationModelValidator validator,
       UserToRoleModelValidator userToRoleModelValidator,
       IDataService<AccessLog> accessLogsData)
        : base(
        gridDataService,
        rolesBusinessService,
        validator,
        accessLogsData)
    {
        this.rolesBusinessService = rolesBusinessService;
        this.userToRoleModelValidator = userToRoleModelValidator;
    }

    [ProtectedEntityAction("model", typeof(UserToRolePermissionService))]
    [HttpPost]
    public async Task<IActionResult> AddUserToRole(UserToRoleModel model)
    {
        model.OperationType = CrudOperationType.Create;
        var validationResult = await this.userToRoleModelValidator.ValidateAsync(model).ToExceptionResponseAsync();

        if (!validationResult.IsValid)
        {
            return this.UnprocessableEntity(validationResult.Errors);
        }

        await this.rolesBusinessService.AddToRole(model);
        return this.Ok("User was successfully added to role.");
    }

    [ProtectedEntityAction("roleId", typeof(RoleIdPermissionService))]
    [HttpDelete]
    public async Task<IActionResult> RemoveFromRole([FromQuery] string userId, [FromQuery] string roleId)
    {
        var model = new UserToRoleModel { RoleId = roleId, UserId = userId, OperationType = CrudOperationType.Delete };

        var validationResult = await this.userToRoleModelValidator.ValidateAsync(model).ToExceptionResponseAsync();

        if (!validationResult.IsValid)
        {
            return this.UnprocessableEntity(validationResult.Errors);
        }

        await this.rolesBusinessService.RemoveFromRole(model);
        return this.Ok("User was successfully removed from role.");
    }

    [HttpGet]
    [ProtectedEntityAction("roleName", typeof(RoleIdPermissionService))]
    public async Task<IActionResult> GetIdByName(string roleName)
        => await this.rolesBusinessService
            .GetIdByName(roleName)
            .ToOkResult();
}