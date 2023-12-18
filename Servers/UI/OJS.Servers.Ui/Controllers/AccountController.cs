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
    [Route("api/[controller]/[action]")]
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
        public async Task<IActionResult> Login([FromBody]LoginRequestModel model)
        {
            if (!this.ModelState.IsValid)
            {
                return this.BadRequest();
            }

            var platformCallResult = new ExternalDataRetrievalResult<ExternalUserInfoModel>();

            try
            {
                this.logger.LogDebug($"START PLATFORM LOGIN CALL FOR USER: {model.UserName}");
                platformCallResult = await this.sulsPlatformHttpClient.GetAsync<ExternalUserInfoModel>(
                    new { model.UserName },
                    string.Format(GetUserInfoByUsernamePath));
                this.logger.LogDebug("ЕND PLATFORM LOGIN CALL. RESULT:");
                this.logger.LogDebug($"{nameof(platformCallResult.IsSuccess)}: {platformCallResult.IsSuccess}");
                this.logger.LogDebug($"{nameof(platformCallResult.ErrorMessage)}: {platformCallResult.ErrorMessage}");
                this.logger.LogDebug($"{nameof(platformCallResult.Data)}: {platformCallResult.Data}");
            }
            catch (Exception e)
            {
                this.logger.LogError(e, "EXCEPTION IN PLATFORM CALL");
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

            return this.Ok();
        }

        [HttpPost]
        public async Task<IActionResult> Logout()
        {
            await this.signInManager.SignOutAsync();
            return this.Ok();
        }
    }
}