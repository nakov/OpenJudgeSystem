namespace OJS.Workers.Executors
{
    using OJS.Workers.Common;

    public interface IProcessExecutorFactory
    {
        IExecutor CreateProcessExecutor(
            int baseTimeUsed,
            int baseMemoryUsed,
            ProcessExecutorType type);
    }
}
