namespace OJS.Services.Administration.Business.Roles;

using OJS.Data.Models.Users;
using OJS.Services.Administration.Models.Roles;
using System.Threading.Tasks;

public interface IRolesBusinessService : IAdministrationOperationService<Role, string, RoleAdministrationModel>
{
    Task AddUserToRole(UserToRoleModel model);
}