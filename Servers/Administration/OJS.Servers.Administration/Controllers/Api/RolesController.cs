namespace OJS.Servers.Administration.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using OJS.Common.Extensions;
using OJS.Data.Models.Users;
using OJS.Servers.Administration.Attributes;
using OJS.Services.Administration.Business.Roles;
using OJS.Services.Administration.Business.Roles.GridData;
using OJS.Services.Administration.Business.Roles.Permissions;
using OJS.Services.Administration.Business.Roles.Validators;
using OJS.Services.Administration.Models.Roles;
using System.Threading.Tasks;

public class RolesController : BaseAdminApiController<Role, string, RoleInListModel, RoleAdministrationModel>
{
    private readonly IRolesBusinessService rolesBusinessService;
    private readonly UserToRoleModelValidator userToRoleModelValidator;

    public RolesController(
       IRoleGridDataService gridDataService,
       IRolesBusinessService rolesBusinessService,
       RoleAdministrationModelValidator validator,
       RoleDeleteValidator deleteValidator,
       UserToRoleModelValidator userToRoleModelValidator)
        : base(
        gridDataService,
        rolesBusinessService,
        validator,
        deleteValidator)
    {
        this.rolesBusinessService = rolesBusinessService;
        this.userToRoleModelValidator = userToRoleModelValidator;
    }

    [ProtectedEntityAction("model", typeof(UserToRolePermissionService))]
    [HttpPost]
    public async Task<IActionResult> AddUserToRole(UserToRoleModel model)
    {
        var validationResult = await this.userToRoleModelValidator.ValidateAsync(model).ToExceptionResponseAsync();

        if (!validationResult.IsValid)
        {
            return this.UnprocessableEntity(validationResult.Errors);
        }

        await this.rolesBusinessService.AddUserToRole(model);
        return this.Ok("User was successfully added to new role.");
    }
}