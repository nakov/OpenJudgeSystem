namespace OJS.Workers.Executors.Implementations
{
    using OJS.Workers.Common;

    public class ProcessExecutorFactory : IProcessExecutorFactory
    {
        private readonly ITasksService tasksService;

        public ProcessExecutorFactory(ITasksService tasksService)
            => this.tasksService = tasksService;

        public IExecutor CreateProcessExecutor(
            int baseTimeUsed,
            int baseMemoryUsed,
            ProcessExecutorType type) =>
            type switch
            {
                ProcessExecutorType.Default => new StandardProcessExecutor(baseTimeUsed, baseMemoryUsed, this.tasksService),
                ProcessExecutorType.Standard => new StandardProcessExecutor(baseTimeUsed, baseMemoryUsed, this.tasksService),
                _ => throw new AggregateException("Invalid process executor type provided."),
            };
    }
}
