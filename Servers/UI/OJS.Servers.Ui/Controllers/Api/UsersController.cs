using FluentExtensions.Extensions;

namespace OJS.Servers.Ui.Controllers.Api;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OJS.Servers.Infrastructure.Controllers;
using OJS.Servers.Infrastructure.Extensions;
using OJS.Servers.Ui.Models.Users;
using OJS.Services.Ui.Business;
using OJS.Services.Ui.Models.Users;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System.Threading.Tasks;
using static Microsoft.AspNetCore.Http.StatusCodes;

[Authorize]
public class UsersController : BaseApiController
{
    private readonly IUsersBusinessService usersBusiness;

    public UsersController(IUsersBusinessService usersBusiness)
        => this.usersBusiness = usersBusiness;

    /// <summary>
    /// Gets user info for the profile page.
    /// </summary>
    /// <param name="username">The username of the user.</param>
    /// <returns>User profile info model.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(UserProfileResponseModel), Status200OK)]
    public async Task<IActionResult> GetProfileInfo([FromQuery] string username)
        => await this.usersBusiness
            .GetUserProfileByUsername(username)
            .Map<UserProfileResponseModel>()
            .ToOkResult();

    [HttpGet]
    [AllowAnonymous]
    [ProducesResponseType(typeof(UserAuthInfoServiceModel), Status200OK)]
    public async Task<IActionResult> GetUserAuthInfo()
        => await this.usersBusiness
            .GetAuthInfo()
            .ToOkResult();
}
