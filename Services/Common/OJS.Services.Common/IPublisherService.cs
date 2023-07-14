namespace OJS.Services.Common;

public interface IPublisherService
{
    void Publish<T>(T obj)
        where T : class;
}