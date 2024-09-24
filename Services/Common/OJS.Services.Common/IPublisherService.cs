namespace OJS.Services.Common;

using System.Threading.Tasks;
using System.Collections.Generic;
using System.Threading;

public interface IPublisherService
{
    Task Publish<T>(T obj, CancellationToken? cancellationToken = null)
        where T : class;

    Task PublishBatch<T>(IReadOnlyCollection<T> objs, CancellationToken? cancellationToken = null)
        where T : class;
}