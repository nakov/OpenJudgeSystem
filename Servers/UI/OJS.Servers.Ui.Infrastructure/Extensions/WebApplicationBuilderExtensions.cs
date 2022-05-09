using Microsoft.Extensions.Logging;

namespace OJS.Servers.Ui.Infrastructure.Extensions;

using Microsoft.AspNetCore.Builder;
using OJS.Servers.Infrastructure.Extensions;

public static class WebApplicationBuilderExtensions
{
    public static WebApplicationBuilder ConfigureBuilder<TProgram>(this WebApplicationBuilder builder)
    {
        builder.Services.ConfigureServices<TProgram>(builder.Configuration);
        builder.Host.UseFileLogger<TProgram>();

        return builder;
    }
}