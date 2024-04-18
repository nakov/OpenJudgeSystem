namespace OJS.Data.Infrastructure
{
    using FluentExtensions.Extensions;
    using System;
    using System.Linq;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.EntityFrameworkCore;
    using OJS.Data.Infrastructure.Models;

    public class BaseDbContext<TDbContext> : DbContext
        where TDbContext : DbContext
    {
        // This constructor is needed for migration creation during design time.
        public BaseDbContext()
        {
        }

        public BaseDbContext(
            DbContextOptions<TDbContext> options)
            : base(options)
        {
        }

        public override int SaveChanges()
        {
            this.ApplyProcessedOn();
            this.ApplyAuditInfo();
            this.ApplyDeletedOn();

            return base.SaveChanges();
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = new())
        {
            this.ApplyProcessedOn();
            this.ApplyAuditInfo();
            this.ApplyDeletedOn();

            return base.SaveChangesAsync(cancellationToken);
        }

        private void ApplyAuditInfo()
            => this.ChangeTracker
                .Entries()
                .Where(e => e is { Entity: IAuditInfoEntity, State: EntityState.Added or EntityState.Modified })
                .ForEach(entry =>
                {
                    var entity = (IAuditInfoEntity)entry.Entity;
                    if (entry.State == EntityState.Added)
                    {
                        entity.CreatedOn = DateTime.UtcNow;
                    }
                    else
                    {
                        entity.ModifiedOn = DateTime.UtcNow;
                    }
                });

        private void ApplyProcessedOn()
            => this.ChangeTracker
                .Entries()
                .Where(e => e is { Entity: IProcessedEntity, State: EntityState.Added or EntityState.Modified })
                .Select(entry => (IProcessedEntity)entry.Entity)
                .ForEach(entity => entity.ProcessedOn = DateTime.UtcNow);

        private void ApplyDeletedOn()
            => this.ChangeTracker
                .Entries()
                .Where(e => e is { Entity: IDeletableEntity, State: EntityState.Deleted })
                .ForEach(entry =>
                {
                    entry.State = EntityState.Modified;
                    var entity = (IDeletableEntity)entry.Entity;
                    entity.DeletedOn = DateTime.UtcNow;
                    entity.IsDeleted = true;
                });
    }
}