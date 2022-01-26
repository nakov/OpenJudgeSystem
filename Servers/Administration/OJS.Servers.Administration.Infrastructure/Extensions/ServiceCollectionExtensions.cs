namespace OJS.Servers.Administration.Infrastructure.Extensions
{
    using AutoCrudAdmin.Extensions;
    using Microsoft.AspNetCore.Http;
    using Microsoft.Extensions.DependencyInjection;
    using OJS.Common.Enumerations;
    using OJS.Data;
    using OJS.Data.Models.Users;
    using OJS.Servers.Infrastructure.Extensions;
    using SoftUni.Data.Infrastructure.Enumerations;
    using SoftUni.Judge.Common.Extensions;
    using System.Linq;

    public static class ServiceCollectionExtensions
    {
        private const ApplicationName AppName = ApplicationName.Administration;

        public static void ConfigureServices<TProgram>(this IServiceCollection services)
            => services
                .AddWebServer<TProgram>()
                .AddHangfireServer(AppName)
                .AddIdentityDatabase<OjsDbContext, UserProfile>(Enumerable.Empty<GlobalQueryFilterType>())
                .AddSoftUniJudgeCommonServices()
                .AddHttpContextAccessor()
                .AddTransient(s => s.GetRequiredService<IHttpContextAccessor>().HttpContext!.User)
                .UseAutoCrudAdmin()
                .AddControllersWithViews();
    }
}