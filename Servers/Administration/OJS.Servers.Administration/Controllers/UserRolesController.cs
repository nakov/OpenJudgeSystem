namespace OJS.Servers.Administration.Controllers;

using AutoCrudAdmin.Enumerations;
using AutoCrudAdmin.Extensions;
using AutoCrudAdmin.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Common;
using OJS.Data.Models.Users;
using OJS.Servers.Administration.Infrastructure.Extensions;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using static Common.GlobalConstants.Roles;
using OJS.Services.Administration.Data;
using System.Linq;

[Authorize(Roles = Administrator)]
public class UserRolesController : BaseAutoCrudAdminController<UserInRole>
{
    public const string RoleIdKey = nameof(UserInRole.RoleId);
    private const string Username = nameof(UserInRole.User);
    private const string RoleName = nameof(UserInRole.Role);

    private readonly IUsersDataService usersDataService;

    public UserRolesController(IUsersDataService usersDataService)
        => this.usersDataService = usersDataService;

    protected override Expression<Func<UserInRole, bool>>? MasterGridFilter
        => this.GetMasterGridFilter();

    protected override IEnumerable<GridAction> DefaultActions
        => new[] { new GridAction { Action = nameof(this.Delete) } };

    protected override IEnumerable<FormControlViewModel> GenerateFormControls(
        UserInRole entity,
        EntityAction action,
        IDictionary<string, string> entityDict,
        IDictionary<string, Expression<Func<object, bool>>> complexOptionFilters,
        Type autocompleteType)
    {
        var formControls = base.GenerateFormControls(entity, action, entityDict, complexOptionFilters, typeof(UserProfile)).ToList();
        formControls.Add(new FormControlViewModel()
        {
            Name = nameof(UserProfile.UserName),
            Options = this.usersDataService.GetQuery(take: GlobalConstants.NumberOfAutocompleteItemsShown).ToList(),
            FormControlType = FormControlType.Autocomplete,
            DisplayName = nameof(UserInRole.User),
            FormControlAutocompleteController = nameof(UsersController).ToControllerBaseUri(),
            FormControlAutocompleteEntityId = nameof(UserInRole.UserId),
        });

        var formControlToRemove = formControls.First(x =>
            x.DisplayName == nameof(UserInRole.User) && x.FormControlType != FormControlType.Autocomplete);
        formControls.Remove(formControlToRemove);

        return formControls;
    }

    protected override Expression<Func<UserInRole, bool>> GetMasterGridFilter()
    {
        var filterExpressions = new List<Expression<Func<UserInRole, bool>>>();

        if (this.TryGetEntityIdForStringColumnFilter(RoleIdKey, out var roleId))
        {
            filterExpressions.Add(ur => ur.RoleId == roleId);
        }

        if (this.TryGetEntityIdForStringColumnFilter(Username, out var username))
        {
            filterExpressions.Add(ur => ur.User.UserName == username);
        }

        if (this.TryGetEntityIdForStringColumnFilter(RoleName, out var roleName))
        {
            filterExpressions.Add(ur => ur.Role.Name == roleName);
        }

        return filterExpressions.CombineMultiple();
    }
}