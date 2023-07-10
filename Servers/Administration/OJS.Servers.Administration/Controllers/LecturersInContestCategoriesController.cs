namespace OJS.Servers.Administration.Controllers;

using Microsoft.AspNetCore.Authorization;
using OJS.Data.Models;
using static OJS.Common.GlobalConstants.Roles;
using AutoCrudAdmin.Enumerations;
using AutoCrudAdmin.Extensions;
using AutoCrudAdmin.ViewModels;
using OJS.Common;
using OJS.Data.Models.Users;
using OJS.Services.Administration.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

[Authorize(Roles = Administrator)]
public class LecturersInContestCategoriesController : BaseAutoCrudAdminController<LecturerInContestCategory>
{
    private readonly IUsersDataService usersDataService;

    public LecturersInContestCategoriesController(IUsersDataService usersDataService) => this.usersDataService = usersDataService;

    protected override IEnumerable<FormControlViewModel> GenerateFormControls(
        LecturerInContestCategory entity,
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
            DisplayName = nameof(LecturerInContestCategory.Lecturer),
            FormControlAutocompleteController = nameof(UsersController).ToControllerBaseUri(),
            FormControlAutocompleteEntityId = nameof(LecturerInContestCategory.LecturerId),
        });

        var formControlToRemove = formControls.First(x =>
            x.DisplayName == nameof(LecturerInContestCategory.Lecturer) && x.FormControlType != FormControlType.Autocomplete);
        formControls.Remove(formControlToRemove);

        return formControls;
    }
}