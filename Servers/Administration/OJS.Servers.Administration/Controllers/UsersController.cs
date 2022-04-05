namespace OJS.Servers.Administration.Controllers;

using OJS.Data.Models.Users;
using System.Collections.Generic;

public class UsersController : BaseAutoCrudAdminController<UserProfile>
{
    protected override IEnumerable<string> ShownColumnNames
        => new[]
        {
            nameof(UserProfile.Id),
            nameof(UserProfile.UserName),
            nameof(UserProfile.Email),
            nameof(UserProfile.IsDeleted),
            nameof(UserProfile.CreatedOn),
        };
}