namespace OJS.Data;

using System;
using System.Linq;
using Models.Contests;
using Models.Participants;
using FluentExtensions.Extensions;
using Infrastructure;
using Microsoft.EntityFrameworkCore;

public class AdminDbContext : OjsDbContext
{
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        ConfigureDateModels(builder);
    }

    private static void ConfigureDateModels(ModelBuilder builder) =>
        builder.Model
            .GetEntityTypes()
            .ToList()
            .Where(t => t.ClrType == typeof(Contest) || t.ClrType == typeof(Participant))
            .SelectMany(t => t.ClrType.GetProperties())
            .Where(p => p.PropertyType == typeof(DateTime) || p.PropertyType == typeof(DateTime?))
            .ForEach(p =>
            {
                var dateTimeValueConverter = new DateTimeValueConverter(p.Name);
                builder.Entity(p.ReflectedType!)
                    .Property(p.Name)
                    .HasConversion(dateTimeValueConverter);
            });
}