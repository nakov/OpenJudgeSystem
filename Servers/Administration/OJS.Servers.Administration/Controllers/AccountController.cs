namespace OJS.Servers.Administration.Controllers
{
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Options;
    using OJS.Data.Models.Users;
    using OJS.Services.Administration.Models;
    using System.Threading.Tasks;

    public class AccountController : BaseAdminViewController
    {
        private readonly SignInManager<UserProfile> signInManager;
        private readonly ApplicationConfig appConfig;

        public AccountController(
            SignInManager<UserProfile> signInManager,
            IOptions<ApplicationConfig> appConfigOptions)
        {
            this.signInManager = signInManager;
            this.appConfig = appConfigOptions.Value;
        }

        public async Task<IActionResult> Logout()
        {
            await this.signInManager.SignOutAsync();
            return this.Redirect(this.appConfig.UiUrl);
        }
    }
}