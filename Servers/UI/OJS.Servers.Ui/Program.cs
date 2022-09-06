namespace OJS.Servers.Ui
{
    using Microsoft.AspNetCore.Builder;
    using Microsoft.Extensions.Caching.Distributed;
    using Microsoft.Extensions.DependencyInjection;
    using OJS.Servers.Ui.Infrastructure.Extensions;
    using System;

    public class Program
    {
        private const string ApiVersion = "v1";

        public static void Main(string[] args)
            => WebApplication.CreateBuilder(args)
                .ConfigureBuilder<Program>(ApiVersion)
                .Build()
                .ConfigureWebApplication(ApiVersion)
                .Run();
    }
}