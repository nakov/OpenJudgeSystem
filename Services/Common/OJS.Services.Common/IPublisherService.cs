namespace OJS.Services.Common;

using System.Threading.Tasks;
using System.Collections.Generic;

public interface IPublisherService
{
    Task Publish<T>(T obj)
        where T : class;

    Task PublishMultiple<T>(IEnumerable<T> objs)
        where T : class;
}