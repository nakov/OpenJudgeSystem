namespace OJS.Services.Common;

using System.Threading.Tasks;

public interface IPublisherService
{
    Task Publish<T>(T obj)
        where T : class;
}