namespace OJS.Servers.Administration.Controllers;

using AutoCrudAdmin.Extensions;
using OJS.Data.Models.Users;
using System;
using System.Linq.Expressions;

public class UserRolesController : BaseAutoCrudAdminController<UserInRole>
{
    public const string RoleIdKey = nameof(UserInRole.RoleId);

    protected override Expression<Func<UserInRole, bool>>? MasterGridFilter
        => this.TryGetEntityIdForStringColumnFilter(RoleIdKey, out var roleId)
            ? ur => ur.RoleId == roleId
            : base.MasterGridFilter;
}