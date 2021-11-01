namespace OJS.Data
{
    using Microsoft.EntityFrameworkCore;
    using OJS.Common.Contracts;
    using OJS.Common.Enumerations;
    using OJS.Data.Infrastructure;
    using OJS.Data.Infrastructure.Extensions;
    using OJS.Data.Models.Users;

    public class OjsDbContext : BaseAuthDbContext<OjsDbContext, UserProfile>
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

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<UserProfile>()
                .Property(x => x.UserName)
                .IsRequired()
                .HasMaxLength(50)
                .IsUnicode(false);

            builder.Entity<UserProfile>()
                .OwnsOne(x => x.UserSettings);

            base.OnModelCreating(builder);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
            => options.ConfigureDbOptions(ApplicationName.Ui);
    }
}