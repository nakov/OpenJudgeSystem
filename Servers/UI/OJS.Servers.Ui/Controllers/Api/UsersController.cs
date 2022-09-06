namespace OJS.Servers.Ui.Controllers.Api;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OJS.Servers.Infrastructure.Extensions;
using System.Threading.Tasks;
using OJS.Servers.Ui.Models.Users;
using OJS.Services.Ui.Business;
using SoftUni.AutoMapper.Infrastructure.Extensions;
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
    /// <returns>User profile info model</returns>
    [HttpGet]
    [ProducesResponseType(typeof(UserProfileResponseModel), Status200OK)]
    public async Task<IActionResult> GetProfileInfo()
        => await this.usersBusiness
            .GetUserProfileByUsername(HttpContext.User.Identity!.Name)
            .Map<UserProfileResponseModel>()
            .ToOkResult();
}
