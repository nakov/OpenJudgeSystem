namespace OJS.Servers.Ui.Controllers.Api
{
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using System.Threading.Tasks;
    using OJS.Servers.Ui.Models.Users;
    using OJS.Services.Ui.Business;
    using SoftUni.AutoMapper.Infrastructure.Extensions;

    [Authorize]
    public class UsersController : Controller
    {
        private readonly IUsersBusinessService usersBusiness;

        public UsersController(IUsersBusinessService usersBusiness)
            => this.usersBusiness = usersBusiness;

        public async Task<UserProfileResponseModel> GetProfileInfo()
            => await this.usersBusiness
                .GetUserProfileByUsername(HttpContext.User.Identity!.Name)
                .Map<UserProfileResponseModel>();
    }
}