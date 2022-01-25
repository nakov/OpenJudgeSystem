namespace OJS.Services.Common.Implementations;

using OJS.Services.Common.Models.Users;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System.Security.Claims;

public class UserProviderService : IUserProviderService
{
    private readonly ClaimsPrincipal claimsPrincipal;
    private UserInfoModel? userInfo;

    public UserProviderService(ClaimsPrincipal claimsPrincipal)
        => this.claimsPrincipal = claimsPrincipal;

    public UserInfoModel GetCurrentUser()
        => this.userInfo ??= this.claimsPrincipal.Map<UserInfoModel>();
}