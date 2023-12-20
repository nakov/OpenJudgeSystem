namespace OJS.Workers.SubmissionProcessors.Formatters
{
    public interface IFormatterService<T>
    {
        string Format(T obj);
    }
}