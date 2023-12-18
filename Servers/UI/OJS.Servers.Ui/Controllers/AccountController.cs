namespace OJS.Servers.Ui.Controllers
{
    using System;
    using System.Threading.Tasks;
    using FluentExtensions.Extensions;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Hosting;
    using Microsoft.Extensions.Logging;
    using OJS.Common;
    using OJS.Data.Models.Users;
    using OJS.Servers.Infrastructure.Controllers;
    using OJS.Servers.Ui.Models;
    using OJS.Services.Common.Models;
    using OJS.Services.Common.Models.Users;
    using OJS.Services.Infrastructure.HttpClients;
    using OJS.Services.Ui.Business;
    using static OJS.Common.GlobalConstants.Urls;

    [Authorize]
    public class AccountController : BaseViewController
    {
        private readonly IUsersBusinessService usersBusinessService;
        private readonly SignInManager<UserProfile> signInManager;
        private readonly ISulsPlatformHttpClientService sulsPlatformHttpClient;
        private readonly ILogger<AccountController> logger;
        private readonly IWebHostEnvironment webHostEnvironment;

        public AccountController(
            IUsersBusinessService usersBusinessService,
            SignInManager<UserProfile> signInManager,
            ISulsPlatformHttpClientService sulsPlatformHttpClient,
            ILogger<AccountController> logger,
            IWebHostEnvironment webHostEnvironment)
        {
            this.usersBusinessService = usersBusinessService;
            this.signInManager = signInManager;
            this.sulsPlatformHttpClient = sulsPlatformHttpClient;
            this.logger = logger;
            this.webHostEnvironment = webHostEnvironment;
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

            var platformCallResult = new ExternalDataRetrievalResult<ExternalUserInfoModel>();

            try
            {
                this.logger.LogInformation("START PLATFORM LOGIN CALL");
                platformCallResult = await this.sulsPlatformHttpClient.GetAsync<ExternalUserInfoModel>(
                    new { model.UserName },
                    string.Format(GetUserInfoByUsernamePath));
                this.logger.LogInformation("ЕND PLATFORM LOGIN CALL");
                this.logger.LogInformation($"PLATFORM RESULT: {platformCallResult.IsSuccess}");
                this.logger.LogInformation($"PLATFORM RESULT: {platformCallResult.ErrorMessage}");
                this.logger.LogInformation($"PLATFORM RESULT: {platformCallResult.Data}");
            }
            catch (Exception e)
            {
                this.logger.LogError("EXCEPTION IN PLATFORM CALL");
                this.logger.LogError(e.GetAllMessages());
            }

            if (platformCallResult.IsSuccess)
            {
                var externalUser = platformCallResult.Data;

                if (externalUser == null)
                {
                    return this.Unauthorized(GlobalConstants.ErrorMessages.NonExistentUser);
                }

                await this.usersBusinessService.AddOrUpdateUser(externalUser.Entity);
            }
            else if (this.webHostEnvironment.IsProduction())
            {
                return this.Unauthorized(GlobalConstants.ErrorMessages.InactiveLoginSystem);
            }

            var signInResult = await this.signInManager
                .PasswordSignInAsync(model.UserName, model.Password, model.RememberMe, false);

            if (!signInResult.Succeeded)
            {
                return this.Unauthorized(GlobalConstants.ErrorMessages.InvalidUsernameOrPassword);
            }

            return this.RedirectToAction("Index", "Home");
        }

        public async Task<IActionResult> Logout()
        {
            await this.signInManager.SignOutAsync();
            return this.RedirectToAction("Index", "Home");
        }
    }
}