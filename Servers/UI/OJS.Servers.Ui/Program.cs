using Microsoft.AspNetCore.Hosting;
using OJS.Servers.Ui.Infrastructure.Extensions;
using System;
using System.Net;

namespace OJS.Servers.Ui
{
    using Microsoft.AspNetCore.Builder;

    public class Program
    {
        private static readonly int Port = int.Parse(Environment.GetEnvironmentVariable("PORT") ?? "5002");

        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.WebHost
                .UseKestrel((hostingContext, options) => { options.Listen(IPAddress.Any, Port); });

            builder.ConfigureBuilder<Program>()
                .Build()
                .ConfigureWebApplication()
                .Run();
        }
    }
}