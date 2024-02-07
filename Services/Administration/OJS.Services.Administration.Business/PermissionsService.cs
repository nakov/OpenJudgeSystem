namespace OJS.Services.Administration.Business;

using OJS.Services.Administration.Models;
using OJS.Services.Common.Models;
using OJS.Services.Common.Models.Users;
using System.Threading.Tasks;

public class PermissionsService<TModel, TId> : IPermissionsService<TModel, TId>
    where TModel : BaseAdministrationModel<TId>
    where TId : notnull
{
    public virtual Task<UserPermissionsModel> GetPermissions(UserInfoModel user, TId id)
        => Task.FromResult(new UserPermissionsModel(user.Id, id, typeof(TModel)).WithFullAccess(true));

    public Task<UserPermissionsModel> GetPermissions(UserInfoModel user, TModel model)
        => Task.FromResult(new UserPermissionsModel(user.Id, model.Id, typeof(TModel)).WithFullAccess(true));
}