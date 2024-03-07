namespace OJS.Workers.Common.Models
{
    /// <summary>
    /// Type of exception that can be thrown by the worker.
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
