namespace OJS.Servers.Infrastructure.Extensions
{
    using Hangfire;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.Extensions.Hosting;
    using OJS.Servers.Infrastructure.Filters;
    using static OJS.Common.GlobalConstants.Urls;

    public static class WebApplicationExtensions
    {
        public static WebApplication UseDefaults(this WebApplication app)
        {
            if (app.Environment.IsDevelopment())
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

            return app;
        }

        public static WebApplication MapDefaultRoutes(this WebApplication app)
        {
            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}");

            return app;
        }

        public static WebApplication UseAndMapHangfireDashboard(this WebApplication app)
        {
            var dashboardOptions = new DashboardOptions
            {
                Authorization = new[] { new HangfireAuthorizationFilter() },
            };

            app.UseHangfireDashboard(HangfirePath);
            app.MapHangfireDashboard(dashboardOptions);

            return app;
        }
    }
}