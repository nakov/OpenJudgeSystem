namespace OJS.Servers.Ui
{
    using Microsoft.AspNetCore.Builder;
    using OJS.Servers.Ui.Infrastructure.Extensions;

    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.ConfigureServices<Program>(builder.Configuration);

            builder
                .Build()
                .Configure()
                .Run();
        }
    }
}