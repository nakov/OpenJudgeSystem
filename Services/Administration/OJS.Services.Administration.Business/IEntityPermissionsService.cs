namespace OJS.Services.Administration.Business;

using OJS.Services.Common.Models.Users;
using SoftUni.Data.Infrastructure.Models;
using SoftUni.Services.Infrastructure;
using System.Threading.Tasks;

public interface IEntityPermissionsService<in TEntity, in T> : IScopedService
    where TEntity : IEntity
{
    public Task<bool> HasPermission(UserInfoModel user, T value, string action);
}