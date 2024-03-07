namespace OJS.Workers.Common.Models
{
    /// <summary>
    /// Exception type that can be thrown by the workers.
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
