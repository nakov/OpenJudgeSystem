namespace OJS.Servers.Ui
{
    using Microsoft.AspNetCore.Builder;
    using OJS.Servers.Ui.Infrastructure.Extensions;

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