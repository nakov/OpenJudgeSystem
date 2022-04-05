namespace OJS.Servers.Administration.Controllers;

using AutoCrudAdmin.Extensions;
using AutoCrudAdmin.ViewModels;
using Microsoft.AspNetCore.Authorization;
using OJS.Data.Models.Users;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using static OJS.Common.GlobalConstants.Roles;

[Authorize(Roles = Administrator)]
public class UserRolesController : BaseAutoCrudAdminController<UserInRole>
{
    public const string RoleIdKey = nameof(UserInRole.RoleId);

    protected override Expression<Func<UserInRole, bool>>? MasterGridFilter
        => this.TryGetEntityIdForStringColumnFilter(RoleIdKey, out var roleId)
            ? ur => ur.RoleId == roleId
            : base.MasterGridFilter;

    protected override IEnumerable<GridAction> DefaultActions
        => new[] { new GridAction { Action = nameof(this.Delete) } };
}