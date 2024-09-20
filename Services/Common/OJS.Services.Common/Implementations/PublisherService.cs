namespace OJS.Services.Common.Implementations;

using System.Threading.Tasks;
using System.Collections.Generic;
using MassTransit;
using System;
using System.Threading;

public class PublisherService(IPublishEndpoint publishEndpoint) : IPublisherService
{
    public Task Publish<T>(T obj, CancellationToken? cancellationToken = null)
        where T : class
        => publishEndpoint.Publish(obj, cancellationToken ?? GetCancellationToken(2000));

    public Task PublishBatch<T>(IEnumerable<T> objs, CancellationToken? cancellationToken = null)
        where T : class
        => publishEndpoint.PublishBatch(objs, cancellationToken ?? GetCancellationToken(5000));

    private static CancellationToken GetCancellationToken(int timeoutMilliseconds)
    {
        var timeout = TimeSpan.FromMilliseconds(timeoutMilliseconds);
        var cancellationTokenSource = new CancellationTokenSource(timeout);
        return cancellationTokenSource.Token;
    }
}