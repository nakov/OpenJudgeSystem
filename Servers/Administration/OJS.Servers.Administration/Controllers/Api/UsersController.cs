namespace OJS.Servers.Administration.Controllers.Api;

using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OJS.Data.Models.Users;
using OJS.Servers.Administration.Attributes;
using OJS.Services.Administration.Business.Users;
using OJS.Services.Administration.Business.Users.GridData;
using OJS.Services.Administration.Business.Users.Validators;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.Contests.Problems;
using OJS.Services.Administration.Models.Users;
using OJS.Services.Administration.Models.Validation;
using OJS.Services.Common.Models.Users;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System.Linq;
using System.Threading.Tasks;

public class UsersController : BaseAdminApiController<UserProfile, string, UserInListModel, UserAdministrationModel>
{
    private readonly IUsersDataService usersDataService;

    public UsersController(
       IUsersGridDataService usersGridData,
       IUsersBusinessService usersBusinessService,
       UserAdministrationModelValidator validator,
       IValidator<BaseDeleteValidationModel<string>> deleteValidator,
       IUsersDataService usersDataService)
        : base(
            usersGridData,
            usersBusinessService,
            validator,
            deleteValidator) =>
        this.usersDataService = usersDataService;

    [HttpGet]
    [ProtectedEntityAction(false)]
    public async Task<IActionResult> GetNameAndId(string? searchString)
    {
        var contests =
            await this.usersDataService
                .GetQueryForUser(
                    this.User.Map<UserInfoModel>(),
                    user => user.UserName!.Contains(searchString ?? string.Empty))
                .MapCollection<UserDropdownModel>()
                .Take(20)
                .ToListAsync();
        return this.Ok(contests);
    }
}