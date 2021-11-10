namespace OJS.Servers.Administration
{
    using Hangfire;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Hosting;
    using OJS.Common.Enumerations;
    using OJS.Common.Utils;
    using OJS.Data;
    using OJS.Data.Models.Users;
    using OJS.Servers.Infrastructure.Extensions;
    using OJS.Servers.Infrastructure.Filters;
    using System;
    using static OJS.Common.GlobalConstants.Urls;

    public class AdministrationStartup
    {
        private readonly IConfiguration configuration;
        private readonly string connectionString;

        public AdministrationStartup(IConfiguration configuration)
        {
            this.configuration = configuration;
            this.connectionString = EnvironmentUtils.GetApplicationConnectionString(ApplicationName.Administration);
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
            => services
                .AddWebServer<AdministrationStartup>(this.configuration)
                .AddHangfireServer(this.connectionString)
                .AddIdentityDatabase<OjsDbContext, UserProfile>()
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

            app.UseHangfireDashboard();

            // Roles are copied from old Judge
            // serviceProvider.CreateOrUpdateRoles().Wait();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");

                endpoints.MapHangfireDashboard(HangfirePath, new DashboardOptions
                {
                    Authorization = new[] { new HangfireAuthorizationFilter() },
                });
            });
        }
    }
}