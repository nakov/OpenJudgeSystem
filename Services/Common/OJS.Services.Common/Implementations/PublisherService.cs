namespace OJS.Services.Common.Implementations;

using System.Threading.Tasks;
using System.Collections.Generic;
using MassTransit;

public class PublisherService(IPublishEndpoint publishEndpoint) : IPublisherService
{
    public Task Publish<T>(T obj)
        where T : class
        => publishEndpoint.Publish(obj);

    public Task PublishBatch<T>(IEnumerable<T> objs)
        where T : class
        => publishEndpoint.PublishBatch(objs);
}