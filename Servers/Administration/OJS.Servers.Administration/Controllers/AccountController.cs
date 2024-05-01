namespace OJS.Servers.Administration.Controllers
{
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Options;
    using OJS.Data.Models.Users;
    using OJS.Services.Infrastructure.Configurations;
    using System.Threading.Tasks;

    public class AccountController : BaseAdminViewController
    {
        private readonly SignInManager<UserProfile> signInManager;
        private readonly ApplicationUrlsConfig appUrls;

        public AccountController(
            SignInManager<UserProfile> signInManager,
            IOptions<ApplicationUrlsConfig> appUrlsOptions)
        {
            this.signInManager = signInManager;
            this.appUrls = appUrlsOptions.Value;
        }

        public async Task<IActionResult> Logout()
        {
            await this.signInManager.SignOutAsync();
            return this.Redirect(this.appUrls.FrontEndUrl);
        }
    }
}