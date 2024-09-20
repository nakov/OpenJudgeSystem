namespace OJS.Services.Common.Implementations;

using System.Threading.Tasks;
using System.Collections.Generic;
using MassTransit;
using System;
using System.Threading;

public class PublisherService(IPublishEndpoint publishEndpoint) : IPublisherService
{
    private const int DefaultTimeoutMilliseconds = 3000;

    public Task Publish<T>(T obj, CancellationToken? cancellationToken = null)
        where T : class
        => publishEndpoint.Publish(
            obj,
            cancellationToken ?? GetCancellationToken(DefaultTimeoutMilliseconds));

    public Task PublishBatch<T>(IReadOnlyCollection<T> objs, CancellationToken? cancellationToken = null)
        where T : class
    {
        // The timeout is calculated based on the number of objects to be published. The more objects, the more time is needed.
        // The timeout is limited to 10 times the default timeout, which is taken if more than 100_000 objects are to be published.
        var objectsCoutTimeoutMultiplier = (int)Math.Min(10, objs.Count * 0.1);
        var timeoutMultiplier = Math.Max(1, objectsCoutTimeoutMultiplier);

        return publishEndpoint.PublishBatch(
            objs,
            cancellationToken ??
            GetCancellationToken(DefaultTimeoutMilliseconds * timeoutMultiplier));
    }

    private static CancellationToken GetCancellationToken(int timeoutMilliseconds)
    {
        var timeout = TimeSpan.FromMilliseconds(timeoutMilliseconds);
        var cancellationTokenSource = new CancellationTokenSource(timeout);
        return cancellationTokenSource.Token;
    }
}