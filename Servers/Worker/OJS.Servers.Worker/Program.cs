namespace OJS.Servers.Worker
{
    using Microsoft.AspNetCore.Builder;
    using OJS.Servers.Worker.Infrastructure.Extensions;

    internal class Program
    {
        public static void Main(string[] args)
            => WebApplication.CreateBuilder(args)
                .ConfigureBuilder<Program>()
                .Build()
                .ConfigureWebApplication()
                .Run();
    }
}
