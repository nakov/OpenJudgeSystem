namespace OJS.Data
{
    using Microsoft.EntityFrameworkCore;
    using OJS.Common.Contracts;
    using OJS.Common.Enumerations;
    using OJS.Data.Infrastructure;
    using OJS.Data.Infrastructure.Extensions;

    public class OjsDbContext : BaseDbContext<OjsDbContext>
    {
        public OjsDbContext()
        {
        }

        public OjsDbContext(
            DbContextOptions<OjsDbContext> options,
            IGlobalQueryFilterTypesCache globalQueryFilterTypesCache)
            : base(options, globalQueryFilterTypesCache)
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
            => options.ConfigureDbOptions(ApplicationName.Ui);
    }
}