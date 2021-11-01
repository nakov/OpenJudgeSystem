namespace OJS.Servers.Ui
{
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Hosting;
    using OJS.Common.Enumerations;
    using OJS.Common.Utils;
    using OJS.Data;
    using OJS.Data.Models.Users;
    using OJS.Servers.Infrastructure.Extensions;
    using System;
    using System.Threading.Tasks;
    using static OJS.Common.GlobalConstants.Roles;

    public class UiStartup
    {
        private readonly IConfiguration configuration;
        private readonly string connectionString;

        public UiStartup(IConfiguration configuration)
        {
            this.configuration = configuration;
            this.connectionString = EnvironmentUtils.GetApplicationConnectionString(ApplicationName.Ui);
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
            => services
                .AddWebServer<UiStartup>(this.configuration)
                .AddIdentityDatabase<OjsDbContext, UserProfile>(this.connectionString)
                .AddControllersWithViews();

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IServiceProvider serviceProvider)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            this.CreateRoles(serviceProvider).Wait();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
            });
        }

        private async Task CreateRoles(IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = serviceProvider.GetRequiredService<UserManager<UserProfile>>();
            string[] roleNames = { Administrator, Lecturer };

            foreach (var roleName in roleNames)
            {
                var roleExist = await roleManager.RoleExistsAsync(roleName);
                if (!roleExist)
                {
                    await roleManager.CreateAsync(new IdentityRole(roleName));
                }
            }

            var userProfile = new UserProfile
            {
                UserName = "judge_admin",
                Email = "judge_admin@softuni.org",
            };

            var userPassword = "1234QwERt)";
            var user = await userManager.FindByEmailAsync(userProfile.Email);

            if(user == null)
            {
                var createPowerUser = await userManager.CreateAsync(userProfile, userPassword);
                if (createPowerUser.Succeeded)
                {
                    await userManager.AddToRoleAsync(userProfile, Administrator);
                }
            }
        }
    }
}