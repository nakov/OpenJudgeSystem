namespace OJS.Data
{
    using Microsoft.EntityFrameworkCore;
    using OJS.Common.Enumerations;
    using OJS.Data.Infrastructure;
    using OJS.Data.Infrastructure.Extensions;

    public class OjsDbContext : BaseDbContext<OjsDbContext>
    {
        public OjsDbContext()
        {
        }

        public OjsDbContext(DbContextOptions<OjsDbContext> options)
            : base(options)
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
            => options.ConfigureDbOptions(ApplicationName.OpenJudgeSystem);
    }
}