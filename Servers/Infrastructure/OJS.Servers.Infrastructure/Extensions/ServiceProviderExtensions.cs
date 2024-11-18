namespace OJS.Servers.Infrastructure.Extensions;

using Common.Enumerations;
using System;
using System.Threading.Tasks;
using Data.Models;
using FluentExtensions.Extensions;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using OJS.Data.Models.Users;
using Services.Common;
using Services.Common.Data.Implementations;
using Services.Common.Implementations;
using Services.Common.Models.Settings;
using Services.Infrastructure.Extensions;
using Services.Infrastructure.Models.Mapping;
using System.Linq;
using YamlDotNet.Serialization;
using static OJS.Common.GlobalConstants.Roles;
using static OJS.Common.GlobalConstants.Settings;

public static class ServiceProviderExtensions
{
    public static async Task CreateOrUpdateRoles(this IServiceProvider serviceProvider)
    {
        var roleManager = serviceProvider.GetRequiredService<RoleManager<Role>>();
        var userManager = serviceProvider.GetRequiredService<UserManager<UserProfile>>();
        string[] roleNames = { Administrator, Lecturer, Developer };
        bool shouldCreateAdminUser = false;

        foreach (var roleName in roleNames)
        {
            var roleExist = await roleManager.RoleExistsAsync(roleName);

            if (!roleExist)
            {
                await roleManager.CreateAsync(new Role(roleName));
            }

            if (roleName == Administrator && !roleExist)
            {
                shouldCreateAdminUser = true;
            }
        }

        if (shouldCreateAdminUser)
        {
            var userProfile = new UserProfile
            {
                UserName = "judge.admin",
                Email = "judge.admin@softuni.org",
            };

            var userPassword = "1234QwERt)";
            var user = await userManager.FindByEmailAsync(userProfile.Email);

            if (user == null)
            {
                var createPowerUser = await userManager.CreateAsync(userProfile, userPassword);
                if (createPowerUser.Succeeded)
                {
                    await userManager.AddToRoleAsync(userProfile, Administrator);
                }
            }
        }
    }

    public static async Task SeedSettings(this IServiceProvider serviceProvider)
    {
        var dataService = serviceProvider.GetRequiredService<ISettingsCommonDataService>();
        SettingServiceModel[] settings =
        [
            new SettingServiceModel { Name = MaxWorkersWorkingTimeInSeconds, Value = "300", Type = SettingType.Numeric },
            new SettingServiceModel { Name = MaxSubmissionsCountAllowedForBatchRetest, Value = "100", Type = SettingType.Numeric },
            new SettingServiceModel { Name = MaxSubmissionTimeToExecuteAllowedForBatchRetest, Value = "20", Type = SettingType.Numeric }
        ];

        foreach (var s in settings)
        {
            await dataService.AddIfNotExists(s);
        }
    }
}

