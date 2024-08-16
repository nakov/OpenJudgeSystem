namespace OJS.Services.Common.Extensions;

using System.Linq;
using OJS.Services.Common.Models.Users;

public static class UserInfoModelExtensions
{
    public static bool IsInRoles(this UserInfoModel model, string[] roles)
        => model.Roles.Any(roles.Contains);
}