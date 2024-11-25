namespace OJS.Servers.Infrastructure.Extensions;

using Common.Enumerations;
using System;
using System.Globalization;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using OJS.Data.Models.Users;
using Services.Common;
using Services.Common.Models.Settings;
using static OJS.Common.GlobalConstants.Roles;
using static OJS.Common.GlobalConstants.Settings;

public static class ServiceProviderExtensions
{
    public static async Task CreateOrUpdateRoles(this IServiceProvider serviceProvider)
    {
        var roleManager = serviceProvider.GetRequiredService<RoleManager<Role>>();
        var userManager = serviceProvider.GetRequiredService<UserManager<UserProfile>>();
        string[] roleNames = [Administrator, Lecturer, Developer];
        var shouldCreateAdminUser = false;

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
            new() { Name = MaxWorkersWorkingTimeInSeconds, Value = "300", Type = SettingType.Numeric },
            new() { Name = MaxSubmissionsCountAllowedForBatchRetest, Value = "100", Type = SettingType.Numeric },
            new() { Name = nameof(MentorMessagesSentCount), Value = "6", Type = SettingType.Numeric },
            new() { Name = nameof(MentorMaxInputTokenCount), Value = "1600", Type = SettingType.Numeric },
            new() { Name = nameof(MentorMaxOutputTokenCount), Value = "800", Type = SettingType.Numeric },
            new() { Name = nameof(MentorQuotaLimit), Value = "10", Type = SettingType.Numeric },
            new() { Name = nameof(MentorQuotaResetTimeInMinutes), Value = "60", Type = SettingType.Numeric },
            new() { Name = MentorModel, Value = "Gpt4oMini", Type = SettingType.ShortString },
        ];

        foreach (var s in settings)
        {
            await dataService.CreateIfNotExists(s);
        }
    }
}

