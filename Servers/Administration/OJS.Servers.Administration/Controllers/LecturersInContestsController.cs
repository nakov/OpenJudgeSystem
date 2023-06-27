using AutoCrudAdmin.Enumerations;
using AutoCrudAdmin.Extensions;
using AutoCrudAdmin.ViewModels;
using OJS.Data.Models.Users;
using OJS.Services.Administration.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace OJS.Servers.Administration.Controllers;

using Microsoft.AspNetCore.Authorization;
using OJS.Data.Models;
using static OJS.Common.GlobalConstants.Roles;

[Authorize(Roles = Administrator)]
public class LecturersInContestsController : BaseAutoCrudAdminController<LecturerInContest>
{
    private readonly IUsersDataService usersDataService;

    public LecturersInContestsController(IUsersDataService usersDataService) => this.usersDataService = usersDataService;

    protected override IEnumerable<FormControlViewModel> GenerateFormControls(
        LecturerInContest entity,
        EntityAction action,
        IDictionary<string, string> entityDict,
        IDictionary<string, Expression<Func<object, bool>>> complexOptionFilters)
    {
        var formControls = base.GenerateFormControls(entity, action, entityDict, complexOptionFilters).ToList();
        formControls.Add(new FormControlViewModel()
        {
            Name = nameof(UserProfile.UserName),
            Options = this.usersDataService.GetQuery(take:20).ToList(),
            FormControlType = FormControlType.Autocomplete,
            DisplayName = nameof(LecturerInContest.Lecturer),
            FormControlAutocompleteController = nameof(UsersController).ToControllerBaseUri(),
            FormControlAutocompleteEntityId = nameof(LecturerInContest.LecturerId),
        });

        var formControlToRemove = formControls.First(x =>
            x.DisplayName == nameof(LecturerInContest.Lecturer) && x.FormControlType != FormControlType.Autocomplete);
        formControls.Remove(formControlToRemove);

        return formControls;
    }
}