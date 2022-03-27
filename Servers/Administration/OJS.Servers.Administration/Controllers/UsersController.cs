namespace OJS.Servers.Administration.Controllers;

using AutoCrudAdmin.ViewModels;
using Microsoft.AspNetCore.Mvc;

using AutoCrudAdmin.Extensions;
using OJS.Data.Models;
using OJS.Data.Models.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

public class UsersController : BaseAutoCrudAdminController<UserProfile>
{
    private const string ExamGroupIdKey = nameof(UserInExamGroup.ExamGroupId);

    public IActionResult AddUserInExamGroup(int examGroupId)
        => this.RedirectToAction(
            "Create",
            "UsersInExamGroups",
            new Dictionary<string, string>
            {
                { nameof(examGroupId), examGroupId.ToString() },
            });

    protected override Expression<Func<UserProfile, bool>>? MasterGridFilter
        => this.TryGetEntityIdForColumnFilter<int>(ExamGroupIdKey, out var examGroupId)
            ? u => u.UsersInExamGroups.Any(x => x.ExamGroupId == examGroupId)
            : base.MasterGridFilter;

    protected override IEnumerable<AutoCrudAdminGridToolbarActionViewModel> CustomToolbarActions
        => this.TryGetEntityIdForColumnFilter<int>(ExamGroupIdKey, out var examGroupId)
            ? this.GetCustomToolbarActions(examGroupId)
            : base.CustomToolbarActions;

    protected override IEnumerable<string> ShownColumnNames
        => new[]
        {
            nameof(UserProfile.Id),
            nameof(UserProfile.UserName),
            nameof(UserProfile.Email),
            nameof(UserProfile.IsDeleted),
            nameof(UserProfile.CreatedOn),
        };

    private IEnumerable<AutoCrudAdminGridToolbarActionViewModel> GetCustomToolbarActions(int examGroupId)
    {
        var routeValues = new Dictionary<string, string>
        {
            { nameof(examGroupId), examGroupId.ToString() },
        };

        return new AutoCrudAdminGridToolbarActionViewModel[]
        {
            new()
            {
                Name = "Add new",
                Action = nameof(this.AddUserInExamGroup),
                RouteValues = routeValues,
            },
        };
    }
}