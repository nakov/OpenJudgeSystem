using System;
using OJS.Servers.Ui.Infrastructure.Extensions;

namespace OJS.Servers.Ui
{
    using Microsoft.AspNetCore.Builder;

    public class Program
    {
        private static readonly int Port = int.Parse(Environment.GetEnvironmentVariable("PORT") ?? "5002");

        public static void Main(string[] args)
            => WebApplication.CreateBuilder(args)
                .ConfigureBuilder<Program>()
                .Build()
                .ConfigureWebApplication()
                .Run();
    }
}