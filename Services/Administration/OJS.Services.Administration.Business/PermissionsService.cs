namespace OJS.Services.Administration.Business;

using OJS.Services.Administration.Models;
using OJS.Services.Common.Models;
using OJS.Services.Common.Models.Users;
using System.Threading.Tasks;

public class PermissionsService<TModel, TId> : IPermissionsService<TModel, TId>
    where TModel : BaseAdministrationModel<TId>
    where TId : notnull
{
    public Task<UserPermissionsModel> GetPermissions(UserInfoModel user, TId id)
        => this.GetPermissionsForExistingEntity(user, id);

    public Task<UserPermissionsModel> GetPermissions(UserInfoModel user, TModel model)
        => string.IsNullOrEmpty(model.Id?.ToString()) || model.Id is <= 0
            ? this.GetPermissionsForNewEntity(user, model)
            : this.GetPermissionsForExistingEntity(user, model.Id);

    protected virtual Task<UserPermissionsModel> GetPermissionsForExistingEntity(UserInfoModel user, TId id)
        => Task.FromResult(this.AllowFullAccessWhen(true, user, id));

    protected virtual Task<UserPermissionsModel> GetPermissionsForNewEntity(UserInfoModel user, TModel model)
        => Task.FromResult(this.AllowFullAccessWhen(true, user, model));

    protected UserPermissionsModel AllowFullAccessWhen(bool allow, UserInfoModel user, TId id)
        => new UserPermissionsModel(user.Id, id, typeof(TModel)).WithFullAccess(allow);

    protected UserPermissionsModel AllowFullAccessWhen(bool allow, UserInfoModel user, TModel model)
        => new UserPermissionsModel(user.Id, model.Id, typeof(TModel)).WithFullAccess(allow);
}