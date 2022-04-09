namespace OJS.Servers.Administration.Controllers
{
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc;
    using OJS.Data.Models.Users;
    using OJS.Servers.Infrastructure.Extensions;
    using System.Threading.Tasks;

    public class AccountController : BaseAdminViewController
    {
        private readonly SignInManager<UserProfile> signInManager;

        public AccountController(SignInManager<UserProfile> signInManager)
            => this.signInManager = signInManager;

        public async Task<IActionResult> Logout()
        {
            await this.signInManager.SignOutAsync();
            this.HttpContext.ClearAuthInfoCookies();
            return this.RedirectToAction("Index", "Home");
        }
    }
}