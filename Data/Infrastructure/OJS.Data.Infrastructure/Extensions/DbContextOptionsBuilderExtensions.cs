namespace OJS.Data.Infrastructure.Extensions
{
    using Microsoft.EntityFrameworkCore;
    using OJS.Common.Enumerations;
    using OJS.Common.Utils;

    public static class DbContextOptionsBuilderExtensions
    {
        public static DbContextOptionsBuilder ConfigureDbOptions(
            this DbContextOptionsBuilder options,
            ApplicationName applicationName)
        {
            if (options.IsConfigured)
            {
                return options;
            }

            // For migrations
            // options.UseSqlServer("Server=.;Database=OpenJudgeSystem;User Id=sa;Password=1234;");
            options.UseSqlServer(EnvironmentUtils.GetApplicationConnectionString(applicationName));

            // TODO: refactor app to not use lazy loading globally and make navigational properties non virtual
            options.UseLazyLoadingProxies();

            return options;
        }
    }
}