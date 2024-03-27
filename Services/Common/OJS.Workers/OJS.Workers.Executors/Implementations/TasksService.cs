namespace OJS.Workers.Executors.Implementations
{
    using System;
    using System.Threading;
    using System.Threading.Tasks;

    public class TasksService : ITasksService
    {
        public TaskInfo RunWithInterval(int interval, Action action)
        {
            var cancellationToken = new CancellationTokenSource();
            var task = Task.Run(
                () =>
                {
                    while (true)
                    {
                        action();
                        if (cancellationToken.IsCancellationRequested)
                        {
                            return;
                        }

                        Thread.Sleep(interval);
                    }
                },
                cancellationToken.Token);
            return new TaskInfo(task, cancellationToken, interval);
        }

        public void Stop(TaskInfo taskInfo)
        {
            taskInfo.CancellationToken.Cancel();
            taskInfo.Task.Wait(taskInfo.UpdateTimeInMs);
        }
    }
}
