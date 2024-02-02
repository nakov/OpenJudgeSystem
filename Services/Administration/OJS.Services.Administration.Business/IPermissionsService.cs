namespace OJS.Services.Administration.Business;

using SoftUni.Services.Infrastructure;

public interface IPermissionsService : IService
{
    bool HasPermission();
}