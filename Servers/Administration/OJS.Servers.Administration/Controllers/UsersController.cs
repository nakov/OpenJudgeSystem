namespace OJS.Servers.Administration.Controllers;

using Microsoft.AspNetCore.Mvc;
using OJS.Data.Models.Users;
using System.Collections.Generic;
using System.Linq;

public class UsersController : BaseAutoCrudAdminController<UserProfile>
{
    public IActionResult ByExamGroup(int examGroupId)
    {
        this.MasterGridFilter = u => u.UsersInExamGroups.Any(x => x.ExamGroupId == examGroupId);
        return base.Index();
    }

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