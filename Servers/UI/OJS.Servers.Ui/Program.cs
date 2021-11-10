namespace OJS.Servers.Ui
{
    using Microsoft.AspNetCore.Builder;
    using Microsoft.Extensions.DependencyInjection;
    using OJS.Common.Enumerations;
    using OJS.Data;
    using OJS.Data.Models.Users;
    using OJS.Servers.Infrastructure.Extensions;

    public class Program
    {
        private const ApplicationName AppName = ApplicationName.Ui;

        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            ConfigureServices(builder.Services);

            var app = builder.Build();
            Configure(app);

            app.Run();
        }

        private static void ConfigureServices(IServiceCollection services)
            => services
                .AddWebServer<Program>()
                .AddHangfireServer(AppName)
                .AddIdentityDatabase<OjsDbContext, UserProfile>()
                .AddControllersWithViews();

        private static void Configure(WebApplication app)
            => app
                .UseDefaults()
                .MapDefaultRoutes();
    }
}