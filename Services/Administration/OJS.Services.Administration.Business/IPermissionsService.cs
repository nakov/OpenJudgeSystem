namespace OJS.Services.Administration.Business;

using OJS.Services.Administration.Models;
using OJS.Services.Common.Models;
using OJS.Services.Common.Models.Users;
using SoftUni.Services.Infrastructure;
using System.Threading.Tasks;

public interface IPermissionsService<in TModel, in TId> : IService
   where TModel : BaseAdministrationModel<TId>
   where TId : notnull
{
   Task<UserPermissionsModel> GetPermissions(UserInfoModel user, TId id);

   Task<UserPermissionsModel> GetPermissions(UserInfoModel user, TModel model);
}