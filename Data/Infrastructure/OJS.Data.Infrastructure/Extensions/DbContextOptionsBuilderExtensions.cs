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
            return options;
        }
    }
}