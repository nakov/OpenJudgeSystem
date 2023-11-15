namespace OJS.Data.Infrastructure.Extensions
{
    using Microsoft.EntityFrameworkCore;

    public static class DbContextOptionsBuilderExtensions
    {
        public static DbContextOptionsBuilder ConfigureDbOptions(
            this DbContextOptionsBuilder options,
            string connectionString)
        {
            if (options.IsConfigured)
            {
                return options;
            }

            // For migrations
            // connectionString = "Server=localhost;Database=OpenJudgeSystem;Integrated Security=True;";
            // connectionString = "Server=localhost;Database=OpenJudgeSystem;User Id=sa;Password=1123QwER;";
            options.UseSqlServer(connectionString);

            // TODO: refactor app to not use lazy loading globally and make navigational properties non virtual
            options.UseLazyLoadingProxies();

            return options;
        }
    }
}