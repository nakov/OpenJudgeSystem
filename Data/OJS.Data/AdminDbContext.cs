namespace OJS.Data;

using System;
using System.Linq;
using System.Reflection;
using Microsoft.EntityFrameworkCore;
using Infrastructure.TimeConverters;
using Validation.Attributes;
using FluentExtensions.Extensions;
using SoftUni.Data.Infrastructure.Models;

public class AdminDbContext : OjsDbContext
{
    protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
        => configurationBuilder.Properties<DateTime>().HaveConversion<LocalDateConverter>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        ConfigureDateModels(builder);
    }

    private static void ConfigureDateModels(ModelBuilder builder) =>
        builder.Model.GetEntityTypes()
            .SelectMany(entityType => entityType.ClrType.GetProperties())
            .Where(property => property.Name is nameof(IAuditInfoEntity.CreatedOn) or nameof(IDeletableEntity.DeletedOn)
                               || property.GetCustomAttributes<UtcConvertableAttribute>().Any())
            .ForEach(p =>
            {
                builder.Entity(p.ReflectedType!)
                    .Property(p.Name)
                    .HasConversion<DualDateTimeValueConverter>();
            });
}