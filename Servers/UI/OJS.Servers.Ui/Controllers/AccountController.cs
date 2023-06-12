namespace OJS.Servers.Ui.Controllers
{
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc;
    using OJS.Common;
    using OJS.Common.Utils;
    using OJS.Data.Models.Users;
    using OJS.Servers.Infrastructure.Controllers;
    using OJS.Servers.Infrastructure.Extensions;
    using OJS.Servers.Ui.Models;
    using OJS.Services.Common.Models.Users;
    using OJS.Services.Infrastructure.HttpClients;
    using OJS.Services.Ui.Business;
    using static OJS.Common.GlobalConstants.Urls;
    using static OJS.Servers.Infrastructure.ServerConstants;

    [Authorize]
    public class AccountController : BaseViewController
    {
        private readonly UserManager<UserProfile> userManager;
        private readonly IUsersBusinessService usersBusinessService;
        private readonly SignInManager<UserProfile> signInManager;
        private readonly ISulsPlatformHttpClientService sulsPlatformHttpClient;

        public AccountController(
            UserManager<UserProfile> userManager,
            IUsersBusinessService usersBusinessService,
            SignInManager<UserProfile> signInManager,
            ISulsPlatformHttpClientService sulsPlatformHttpClient)
        {
            this.userManager = userManager;
            this.usersBusinessService = usersBusinessService;
            this.signInManager = signInManager;
            this.sulsPlatformHttpClient = sulsPlatformHttpClient;
        }

        [AllowAnonymous]
        public IActionResult Login(string returnUrl)
        {
            this.ViewData[ViewDataKeys.ReturnUrl] = returnUrl;
            return this.RedirectToAction("Index", "Home");
        }

        [HttpPost]
        [AllowAnonymous]
        // [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login([FromBody]LoginRequestModel model)
        {
            if (!this.ModelState.IsValid)
            {
                return this.RedirectToAction("Index", "Home");
            }

            ExternalUserInfoModel? externalUser;

            var platformCallResult = await this.sulsPlatformHttpClient.GetAsync<ExternalUserInfoModel>(
                new { model.UserName },
                string.Format(GetUserInfoByUsernamePath));

            if (platformCallResult.IsSuccess)
            {
                externalUser = platformCallResult.Data;

                if (externalUser == null)
                {
                    return this.Unauthorized(GlobalConstants.ErrorMessages.NonExistentUser);
                }

                await this.usersBusinessService.AddOrUpdateUser(externalUser.Entity);
            }
            else if (EnvironmentUtils.IsProduction())
            {
                return this.Unauthorized(GlobalConstants.ErrorMessages.InactiveLoginSystem);
            }

            var user = await this.userManager.FindByNameAsync(model.UserName);

            var signInResult = await this.signInManager
                .PasswordSignInAsync(model.UserName, model.Password, model.RememberMe, false);

            if (!signInResult.Succeeded)
            {
                return this.Unauthorized(GlobalConstants.ErrorMessages.InvalidUsernameOrPassword);
            }

            var roles = await this.userManager.GetRolesAsync(user);

            // this.HttpContext.AppendAuthInfoCookies(roles, user.UserName);
            return this.RedirectToAction("Index", "Home");
        }

        public async Task<IActionResult> Logout()
        {
            await this.signInManager.SignOutAsync();
            this.HttpContext.ClearAuthInfoCookies();
            return this.RedirectToAction("Index", "Home");
        }
    }
}