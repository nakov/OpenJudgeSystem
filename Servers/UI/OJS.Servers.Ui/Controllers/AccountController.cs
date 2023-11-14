namespace OJS.Servers.Ui.Controllers
{
    using System;
    using System.Threading.Tasks;
    using FluentExtensions.Extensions;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;
    using OJS.Common;
    using OJS.Common.Utils;
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
        private readonly UserManager<UserProfile> userManager;
        private readonly IUsersBusinessService usersBusinessService;
        private readonly SignInManager<UserProfile> signInManager;
        private readonly ISulsPlatformHttpClientService sulsPlatformHttpClient;
        private readonly ILogger<AccountController> logger;

        public AccountController(
            UserManager<UserProfile> userManager,
            IUsersBusinessService usersBusinessService,
            SignInManager<UserProfile> signInManager,
            ISulsPlatformHttpClientService sulsPlatformHttpClient,
            ILogger<AccountController> logger)
        {
            this.userManager = userManager;
            this.usersBusinessService = usersBusinessService;
            this.signInManager = signInManager;
            this.sulsPlatformHttpClient = sulsPlatformHttpClient;
            this.logger = logger;
        }

        [HttpPost]
        [AllowAnonymous]
        // [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login([FromBody]LoginRequestModel model)
        {
            if (!this.ModelState.IsValid)
            {
                return this.BadRequest();
            }

            ExternalUserInfoModel? externalUser;

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

            return this.Ok();
        }

        public async Task<IActionResult> Logout()
        {
            await this.signInManager.SignOutAsync();
            return this.Ok();
        }
    }
}