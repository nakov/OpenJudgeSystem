namespace OJS.Servers.Administration.Controllers;

using AutoCrudAdmin.Enumerations;
using AutoCrudAdmin.Extensions;
using AutoCrudAdmin.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Common;
using Microsoft.Extensions.Options;
using OJS.Data.Models.Users;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using static Common.GlobalConstants.Roles;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models;
using System.Linq;

[Authorize(Roles = Administrator)]
public class UserRolesController : BaseAutoCrudAdminController<UserInRole>
{
    public const string RoleIdKey = nameof(UserInRole.RoleId);

    private readonly IUsersDataService usersDataService;

    public UserRolesController(
        IUsersDataService usersDataService,
        IOptions<ApplicationConfig> appConfigOptions)
        : base(appConfigOptions)
        => this.usersDataService = usersDataService;

    protected override Expression<Func<UserInRole, bool>>? MasterGridFilter
        => this.TryGetEntityIdForStringColumnFilter(RoleIdKey, out var roleId)
            ? ur => ur.RoleId == roleId
            : base.MasterGridFilter;

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
}