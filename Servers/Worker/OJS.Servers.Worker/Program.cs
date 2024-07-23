namespace OJS.Servers.Worker;

using Microsoft.AspNetCore.Builder;
using OJS.Servers.Infrastructure.Extensions;
using OJS.Servers.Worker.Extensions;

internal class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.ConfigureServices(builder.Configuration);
        builder.Host.UseElasticsearchLogger(builder.Environment);

        var app = builder.Build();

        app.ConfigureWebApplication();
        app.Run();
    }
}
