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
                async () =>
                {
                    while (!cancellationToken.IsCancellationRequested)
                    {
                        action();

                        await Task.Delay(interval, cancellationToken.Token).ConfigureAwait(false);
                    }
                },
                cancellationToken.Token);

            return new TaskInfo(task, cancellationToken, interval);
        }

        public void StopTask(TaskInfo taskInfo)
        {
            taskInfo.CancellationToken.Cancel();
            taskInfo.Task.Wait(taskInfo.UpdateTimeInMs);
        }
    }
}
