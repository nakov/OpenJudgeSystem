namespace OJS.Workers.ExecutionStrategies.Sql
{
    using System.Collections.Generic;

    public class SqlResult
    {
        public bool Completed { get; set; }

        public ICollection<string> Results { get; set; } = new List<string>();
    }
}
