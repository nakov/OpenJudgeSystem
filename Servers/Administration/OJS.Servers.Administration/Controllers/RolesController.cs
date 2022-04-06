namespace OJS.Servers.Administration.Controllers;

using AutoCrudAdmin.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OJS.Data.Models.Users;
using System.Collections.Generic;
using static OJS.Common.GlobalConstants.Roles;

[Authorize(Roles = Administrator)]
public class RolesController : BaseAutoCrudAdminController<Role>
{
    public IActionResult UsersInRole(IDictionary<string, string> complexId)
        => this.RedirectToActionWithStringFilter(
            nameof(UserRolesController),
            UserRolesController.RoleIdKey,
            this.GetEntityIdFromQuery<string>(complexId));

    protected override IEnumerable<GridAction> CustomActions
        => new GridAction[]
        {
            new () { Name = "Users", Action = nameof(this.UsersInRole) },
        };
}