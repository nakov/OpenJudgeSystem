#nullable disable
namespace OJS.Workers.Executors.Implementations
{
    using OJS.Workers.Common;
    using OJS.Workers.Common.Helpers;

    public class ProcessExecutorFactory : IProcessExecutorFactory
    {
        private readonly ITasksService tasksService;

        public ProcessExecutorFactory(ITasksService tasksService)
            => this.tasksService = tasksService;

        public IExecutor CreateProcessExecutor(
            int baseTimeUsed,
            int baseMemoryUsed,
            ProcessExecutorType type)
        {
            if (OsPlatformHelpers.IsUnix())
            {
                return new StandardProcessExecutor(baseTimeUsed, baseMemoryUsed, this.tasksService);
            }

            switch (type)
            {
                case ProcessExecutorType.Standard:
                    return new StandardProcessExecutor(baseTimeUsed, baseMemoryUsed, this.tasksService);
                case ProcessExecutorType.Restricted:
                    return new RestrictedProcessExecutor(baseTimeUsed, baseMemoryUsed, this.tasksService);
                default:
                    return null;
            }
        }
    }
}
