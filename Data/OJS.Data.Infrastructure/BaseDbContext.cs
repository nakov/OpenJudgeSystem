namespace OJS.Data.Infrastructure
{
    using FluentExtensions.Extensions;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Reflection;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.EntityFrameworkCore;
    using OJS.Data.Infrastructure.Attributes;
    using OJS.Data.Infrastructure.Configurators;
    using OJS.Data.Infrastructure.Enumerations;
    using OJS.Data.Infrastructure.Models;

    public class BaseDbContext<TDbContext> : DbContext
        where TDbContext : DbContext
    {
        private readonly IGlobalQueryFilterTypesCache? globalQueryFilterTypesCache;

        // This constructor is needed for migration creation during design time.
        public BaseDbContext()
        {
        }

        public BaseDbContext(
            DbContextOptions<TDbContext> options,
            IGlobalQueryFilterTypesCache? globalQueryFilterTypesCache = null)
            : base(options)
            => this.globalQueryFilterTypesCache = globalQueryFilterTypesCache;

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

        // Called with Reflection
        [GlobalQueryFilter(GlobalQueryFilterType.DeletableEntity)]
        public void SetGlobalDeletableEntityQueryFilter<TEntity>(ModelBuilder builder)
            where TEntity : class, IDeletableEntity
            => builder.Entity<TEntity>()
                .HasQueryFilter(x => !x.IsDeleted);

        protected override void OnModelCreating(ModelBuilder builder)
        {
            this.GetMethodsWithBaseTypesForModelBuilderConfiguration()
                .Select(x => this.CreateFluentApiConfigurator(x.Key, x.Value))
                .ForEach(configurator =>
                    builder.Model
                        .GetEntityTypes()
                        .ForEach(t => configurator.Configure(this, t.ClrType, builder)));

            base.OnModelCreating(builder);
        }

        private void ApplyAuditInfo()
            => this.ChangeTracker
                .Entries()
                .Where(e =>
                    e.Entity is IAuditInfoEntity &&
                    e.State is EntityState.Added or EntityState.Modified)
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
                .Where(e =>
                    e.Entity is IProcessedEntity &&
                    e.State is EntityState.Added or EntityState.Modified)
                .Select(entry => (IProcessedEntity)entry.Entity)
                .ForEach(entity => entity.ProcessedOn = DateTime.UtcNow);

        private void ApplyDeletedOn()
            => this.ChangeTracker
                .Entries()
                .Where(e =>
                    e.Entity is IDeletableEntity &&
                    (e.State == EntityState.Deleted))
                .ForEach(entry =>
                {
                    entry.State = EntityState.Modified;
                    var entity = (IDeletableEntity)entry.Entity;
                    entity.DeletedOn = DateTime.UtcNow;
                    entity.IsDeleted = true;
                });

        private IDictionary<MethodInfo, Type> GetMethodsWithBaseTypesForModelBuilderConfiguration()
            => typeof(TDbContext)
                .GetMethods(BindingFlags.Public | BindingFlags.Instance)
                .Where(this.MethodHasFluentApiConfiguration)
                .ToDictionary(
                    m => m,
                    m => m
                        .GetGenericMethodDefinition()
                        .GetGenericArguments()
                        .SelectMany(i => i.GetGenericParameterConstraints())
                        .Last());

        private bool MethodHasFluentApiConfiguration(MethodBase method)
            => method.IsGenericMethod &&
               method.GetCustomAttributes().OfType<FluentApiConfigurationAttribute>().Any();

        private FluentApiConfigurator CreateFluentApiConfigurator(MethodInfo method, Type entityType)
            => method.GetCustomAttribute<FluentApiConfigurationAttribute>() is GlobalQueryFilterAttribute
                globalQueryFilterAttribute
                ? new GlobalQueryFilterConfigurator(
                    method,
                    entityType,
                    globalQueryFilterAttribute,
                    this.globalQueryFilterTypesCache?.GetAll() ?? Enumerable.Empty<GlobalQueryFilterType>())
                : new FluentApiConfigurator(method, entityType);
    }
}