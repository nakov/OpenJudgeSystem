namespace OJS.Servers.Ui.Controllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OJS.Servers.Infrastructure.Controllers;
using OJS.Servers.Infrastructure.Extensions;
using OJS.Servers.Ui.Models.Users;
using OJS.Services.Infrastructure.Extensions;
using OJS.Services.Ui.Business;
using OJS.Services.Ui.Models.Users;
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
    /// If no profile exists an error will be returned.
    /// If the user is not logged in but the profile exists, then only the Username will be returned.
    /// If the user is owner or has a role, then the profile is returned with more details.
    /// </summary>
    /// <param name="username">The username of the user.</param>
    /// <returns>User profile info model.</returns>
    [HttpGet]
    [AllowAnonymous]
    [ProducesResponseType(typeof(UserProfileResponseModel), Status200OK)]
    public async Task<IActionResult> GetProfileInfo([FromQuery] string? username)
        => await this.usersBusiness
            .GetUserShortOrFullProfileByLoggedInUserIsAdminOrProfileOwner(username)
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
