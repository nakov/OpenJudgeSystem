namespace OJS.Workers.SubmissionProcessors.Formatters
{
    using SoftUni.Services.Infrastructure;

    public interface IFormatterServiceFactory : ISingletonService
    {
        IFormatterService<T> Get<T>();
    }
}