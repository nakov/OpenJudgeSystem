namespace OJS.Services.Administration.Business;

using OJS.Services.Common.Models.Users;
using SoftUni.Services.Infrastructure;

public interface IUserProviderService : IScopedService
{
    UserInfoModel GetCurrentUser();
}