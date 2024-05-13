namespace OJS.Services.Common;

using OJS.Services.Common.Models.Users;
using OJS.Services.Infrastructure;

public interface IUserProviderService : IScopedService
{
    UserInfoModel GetCurrentUser();
}