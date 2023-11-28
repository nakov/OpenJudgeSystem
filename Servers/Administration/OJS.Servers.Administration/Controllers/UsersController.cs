namespace OJS.Servers.Administration.Controllers;

using OJS.Data.Models.Users;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using AutoCrudAdmin.ViewModels;
using Microsoft.Extensions.Options;
using OJS.Services.Administration.Models;

public class UsersController : BaseAutoCrudAdminController<UserProfile>
{
    public UsersController(IOptions<ApplicationConfig> appConfigOptions)
        : base(appConfigOptions)
    {
    }

    protected override IEnumerable<string> ShownColumnNames
        => new[]
        {
            nameof(UserProfile.Id),
            nameof(UserProfile.UserName),
            nameof(UserProfile.Email),
            nameof(UserProfile.IsDeleted),
            nameof(UserProfile.CreatedOn),
        };

    public override IEnumerable<DropDownViewModel> Autocomplete([FromQuery] string searchTerm, string searchProperty)
        => base.Autocomplete(searchTerm, nameof(UserProfile.UserName));
}