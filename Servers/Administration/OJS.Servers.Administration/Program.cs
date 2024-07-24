namespace OJS.Servers.Administration;

using Microsoft.AspNetCore.Builder;
using OJS.Servers.Administration.Extensions;
using OJS.Servers.Infrastructure.Extensions;

internal class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.ConfigureServices(builder.Configuration);
        builder.Host.UseLogger(builder.Environment);

        var app = builder.Build();

        app.ConfigureWebApplication();
        app.Run();
    }
}
