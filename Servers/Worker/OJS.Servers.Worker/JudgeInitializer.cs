namespace Interactive.Servers.Judge
{
    using AspNetCore.AsyncInitialization;
    using System.Threading.Tasks;

    public class JudgeInitializer : IAsyncInitializer
    {
        // This method is executed on host startup. Put necessary initialization setup here.
        public Task InitializeAsync()
            => Task.CompletedTask;
    }
}
