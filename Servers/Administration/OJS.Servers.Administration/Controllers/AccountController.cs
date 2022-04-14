namespace OJS.Servers.Administration.Controllers
{
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc;
    using OJS.Data.Models.Users;
    using OJS.Servers.Infrastructure.Extensions;
    using OJS.Services.Common;
    using System.Threading.Tasks;

    public class AccountController : BaseAdminViewController
    {
        private readonly SignInManager<UserProfile> signInManager;
        private readonly IApplicationUrlsService applicationUrls;

        public AccountController(
            SignInManager<UserProfile> signInManager,
            IApplicationUrlsService applicationUrls)
        {
            this.signInManager = signInManager;
            this.applicationUrls = applicationUrls;
        }

        public async Task<IActionResult> Logout()
        {
            await this.signInManager.SignOutAsync();
            this.HttpContext.ClearAuthInfoCookies();
            return this.Redirect(this.applicationUrls.GetUiUrlOrDefault());
        }
    }
}