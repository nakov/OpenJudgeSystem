namespace Interactive.Servers.Judge
{
    using Interactive.Servers.Extensions;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Logging;

    public class JudgeStartup
    {
        private readonly IConfiguration configuration;
        private readonly IHostingEnvironment env;

        public JudgeStartup(IConfiguration configuration, IHostingEnvironment env)
        {
            this.configuration = configuration;
            this.env = env;
        }

        public void ConfigureServices(IServiceCollection services)
            => services
                .AddWebServer<JudgeStartup, JudgeInitializer>(this.configuration)
                .AddInternalAuthenticationSettings(this.configuration)
                .AddAuthorization()
                .AddConfiguration(this.configuration)
                .AddJwtAuthentication()
                .AddSubmissionExecutor()
                .AddHealthMonitoring();

        public void Configure(IApplicationBuilder app)
            => app
                .UseAuthentication()
                .UseWebApi(this.configuration, this.env)
                .UseHealthMonitoring();
    }
}
