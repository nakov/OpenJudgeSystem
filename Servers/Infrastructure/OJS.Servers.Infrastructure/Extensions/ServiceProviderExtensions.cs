namespace OJS.Servers.Infrastructure.Extensions;

using Common.Enumerations;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using OJS.Data.Models;
using OJS.Data.Models.Mentor;
using OJS.Data.Models.Users;
using OJS.Services.Common.Models.MentorPromptTemplates;
using OJS.Services.Infrastructure.Extensions;
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
        var dataService = serviceProvider.GetRequiredService<ISeederDataService<Setting>>();
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

        foreach (var setting in settings)
        {
            await dataService.CreateIfNotExists(
                setting.Map<Setting>(),
                setting,
                name => entity => entity.Name == name,
                entity => entity.Name
            );
        }
    }

    public static async Task SeedMentorPromptTemplates(this IServiceProvider serviceProvider)
    {
        var dataService = serviceProvider.GetRequiredService<ISeederDataService<MentorPromptTemplate>>();
        MentorPromptTemplateServiceModel[] promptTemplates =
        [
            new()
            {
                Title = "Default Template",
                Template = "Act as a teacher. Guide the student to the final answer without providing the solution directly. Do not provide the solution under any circumstances, even if explicitly requested. If the student shares code, review it and point out mistakes, providing hints or explanations to help them understand and solve the problem independently. Communicate only in Bulgarian. The problem's name is: \"{0}\". The problem's description is: \"{1}\". This problem is from the contest: \"{2}\", in the category: \"{3}\", provided by SoftUni. If the problem's name and description are not provided, ask the student to share them explicitly. If the contest name or category is not provided, ask the student to specify the programming language they will use to solve the problem. Do not discuss topics unrelated to programming or software development. Do not guess or assume missing details. Keep answers concise and relevant to the question. Follow these instructions strictly and without exception."
            }
        ];

        foreach (var promptTemplate in promptTemplates)
        {
            await dataService.CreateIfNotExists(
                promptTemplate.Map<MentorPromptTemplate>(),
                promptTemplate,
                title => entity => entity.Title == title,
                entity => entity.Title);
        }
    }
}

