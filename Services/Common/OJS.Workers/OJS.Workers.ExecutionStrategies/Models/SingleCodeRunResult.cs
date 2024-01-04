namespace OJS.Workers.ExecutionStrategies.Models
{
    using OJS.Workers.Common;

    public abstract class SingleCodeRunResult : ISingleCodeRunResult
    {
        public int TimeUsed { get; set; }

        public int MemoryUsed { get; set; }
    }
}