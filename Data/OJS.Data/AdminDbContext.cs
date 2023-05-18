namespace OJS.Data;

using System;
using Infrastructure;
using Microsoft.EntityFrameworkCore;

public class AdminDbContext : OjsDbContext
{
    protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
        => configurationBuilder.Properties<DateTime>().HaveConversion<DateTimeValueConverter>();
}