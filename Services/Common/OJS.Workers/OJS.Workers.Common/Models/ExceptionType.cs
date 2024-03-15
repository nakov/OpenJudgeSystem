namespace OJS.Workers.Common.Models
{
    /// <summary>
    /// Possible types of exceptions during the execution of a worker.
    /// </summary>
    public enum ExceptionType
    {
        None = 0,
        Compile = 1,
        Strategy = 2,
        Runtime = 3,
        Remote = 4,
    }
}
