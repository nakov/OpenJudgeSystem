namespace OJS.Services.Common;

using OJS.Services.Common.Models.Users;
using SoftUni.Services.Infrastructure;

public interface IUserProviderService : IScopedService
{
    UserInfoModel GetCurrentUser();
}