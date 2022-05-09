using OJS.Servers.Ui.Infrastructure.Extensions;

namespace OJS.Servers.Ui
{
    using Microsoft.AspNetCore.Builder;

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