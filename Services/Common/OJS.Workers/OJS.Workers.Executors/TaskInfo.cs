namespace OJS.Workers.Executors
{
    using System.Threading;
    using System.Threading.Tasks;

    public class TaskInfo
    {
        public TaskInfo(Task task, CancellationTokenSource cancellationToken, int updateTimeInMs)
        {
            this.Task = task;
            this.CancellationToken = cancellationToken;
            this.UpdateTimeInMs = updateTimeInMs;
        }

        public Task Task { get; set; }

        public CancellationTokenSource CancellationToken { get; set; }

        public int UpdateTimeInMs { get; set; }
    }
}
