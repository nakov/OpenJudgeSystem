namespace OJS.Servers.Administration.Controllers;

using AutoCrudAdmin.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using OJS.Data.Models.Users;
using OJS.Services.Administration.Models;
using System.Collections.Generic;
using static OJS.Common.GlobalConstants.Roles;

[Authorize(Roles = Administrator)]
public class RolesController : BaseAutoCrudAdminController<Role>
{
    public RolesController(IOptions<ApplicationConfig> appConfigOptions)
        : base(appConfigOptions)
    {
    }

    protected override IEnumerable<GridAction> CustomActions
        => new GridAction[] { new () { Name = "Users", Action = nameof(this.UsersInRole) }, };

    public IActionResult UsersInRole(IDictionary<string, string> complexId)
        => this.RedirectToActionWithStringFilter(
            nameof(UserRolesController),
            UserRolesController.RoleIdKey,
            this.GetEntityIdFromQuery<string>(complexId));
}