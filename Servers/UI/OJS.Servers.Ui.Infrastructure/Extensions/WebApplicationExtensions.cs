namespace OJS.Servers.Ui.Infrastructure.Extensions
{
    using Microsoft.AspNetCore.Builder;
    using OJS.Servers.Infrastructure.Extensions;

    public static class WebApplicationExtensions
    {
        public static WebApplication Configure(this WebApplication app)
            => app
                .UseDefaults()
                .MapDefaultRoutes();
    }
}