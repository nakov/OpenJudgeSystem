namespace OJS.Servers.Administration.Controllers;

using AutoCrudAdmin.ViewModels;
using FluentExtensions.Extensions;
using Microsoft.AspNetCore.Identity;
using OJS.Services.Administration.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

public class UserRolesController : BaseAutoCrudAdminController<IdentityUserRole<string>>
{
    private readonly RoleManager<IdentityRole> roleManager;
    private readonly IUsersDataService usersData;

    public UserRolesController(
        RoleManager<IdentityRole> roleManager,
        IUsersDataService usersData)
    {
        this.roleManager = roleManager;
        this.usersData = usersData;
    }

    protected override async Task<IEnumerable<FormControlViewModel>> GenerateFormControlsAsync(
        IdentityUserRole<string> entity,
        EntityAction action,
        IDictionary<string, string> entityDict,
        IDictionary<string, Expression<Func<object, bool>>> complexOptionFilters)
    {
        var roles = this.roleManager.Roles
            .Select(x => new DropDownViewModel
            {
                Name = x.Name,
                Value = x.Id,
            })
            .ToList();

        var users = await this.usersData
            .All()
            .SelectAsync(x => new DropDownViewModel
            {
                Name = x.UserName,
                Value = x.Id,
            })
            .ToListAsync();

        return new List<FormControlViewModel>()
        {
            new()
            {
                Name = nameof(IdentityUserRole<string>.RoleId),
                Type = typeof(IEnumerable<DropDownViewModel>),
                Options = roles,
            },
            new()
            {
                Name = nameof(IdentityUserRole<string>.UserId),
                Type = typeof(IEnumerable<DropDownViewModel>),
                Options = users,
            }
        };
    }
}