namespace OJS.Servers.Administration
{
    using Microsoft.AspNetCore.Builder;
    using OJS.Servers.Administration.Infrastructure.Extensions;

    public class Program
    {
        public static void Main(string[] args)
            => WebApplication.CreateBuilder(args)
                .ConfigureBuilder<Program>()
                .Build()
                .ConfigureWebApplication()
                .Run();
    }
}