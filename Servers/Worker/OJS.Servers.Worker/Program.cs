namespace OJS.Servers.Worker
{
    using Microsoft.AspNetCore.Builder;
    using OJS.Servers.Worker.Infrastructure.Extensions;

    internal class Program
    {
        private const string ApiVersion = "v1";

        public static void Main(string[] args)
            => WebApplication.CreateBuilder(args)
                .ConfigureBuilder<Program>(ApiVersion)
                .Build()
                .ConfigureWebApplication(ApiVersion)
                .Run();

//         private static readonly ApplicationName[] ApplicationUrls =
//         {
//             ApplicationName.Auth,
//         };
//
//         public static async Task Main(string[] args)
//         {
// #if DEBUG
//             // Enable the line below when you want to test
//             // the application inside a docker container
//             // SetDebugEnvironment();
// #endif
//             var host = WebHost
//                 .CreateDefaultBuilder(args)
//                 .BuildWebHostConfiguration<JudgeStartup>(
//                     args,
//                     applicationUrls: ApplicationUrls)
//                 .Build();
//
//             await host.InitAsync();
//
//             await host.RunAsync();
//         }
//
//         private static void SetDebugEnvironment()
//         {
//             if (OSPlatformHelpers.IsUnix())
//             {
//                 // Debug mode in Docker overrides environment to "Development"
//                 // and we have to bring it back to "Docker" manually.
//                 Environment.SetEnvironmentVariable(
//                     EnvironmentVariables.EnvironmentKey,
//                     EnvironmentVariables.DockerValue);
//             }
//         }
    }
}
