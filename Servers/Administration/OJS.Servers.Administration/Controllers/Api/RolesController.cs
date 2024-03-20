namespace OJS.Servers.Administration.Controllers.Api;

using OJS.Data.Models.Users;
using OJS.Services.Administration.Business.Roles;
using OJS.Services.Administration.Business.Roles.GridData;
using OJS.Services.Administration.Business.Roles.Validators;
using OJS.Services.Administration.Models.Roles;

public class RolesController : BaseAdminApiController<Role, string, RoleInListModel, RoleAdministrationModel>
{
    public RolesController(
       IRoleGridDataService gridDataService,
       IRolesBusinessService rolesBusinessService,
       RoleAdministrationModelValidator validator,
       RoleDeleteValidator deleteValidator)
        : base(
        gridDataService,
        rolesBusinessService,
        validator,
        deleteValidator)
    {
    }
}