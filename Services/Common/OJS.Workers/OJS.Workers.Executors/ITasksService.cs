namespace OJS.Workers.Executors
{
    using System;

    public interface ITasksService
    {
        TaskInfo RunWithInterval(int interval, Action action);

        void Stop(TaskInfo taskInfo);
    }
}
