namespace OJS.Services.Common.Implementations;

using System.Threading.Tasks;
using System.Collections.Generic;
using MassTransit;
using System;
using System.Threading;

public class PublisherService(IPublishEndpoint publishEndpoint) : IPublisherService
{
    private const int DefaultTimeoutMilliseconds = 3000;

    public async Task Publish<T>(T obj, CancellationToken? cancellationToken = null)
        where T : class
    {
        if (cancellationToken != null)
        {
            await publishEndpoint.Publish(obj, cancellationToken.Value);
            return;
        }

        using var cancellationTokenSource = new CancellationTokenSource(DefaultTimeoutMilliseconds);

        // Await the result of the Publish, otherwise the cancellation token source might be disposed prematurely.
        await publishEndpoint.Publish(obj, cancellationTokenSource.Token);
    }

    public async Task PublishBatch<T>(IReadOnlyCollection<T> objs, CancellationToken? cancellationToken = null)
        where T : class
    {
        if (cancellationToken != null)
        {
            await publishEndpoint.PublishBatch(objs, cancellationToken.Value);
            return;
        }

        // The timeout is calculated based on the number of objects to be published. The more objects, the more time is needed.
        // The timeout is limited to 10 times the default timeout, which is taken if more than 100_000 objects are to be published.
        var objectsCountTimeoutMultiplier = (int)Math.Min(10, objs.Count * 0.1);
        var timeoutMultiplier = Math.Max(1, objectsCountTimeoutMultiplier);

        using var cancellationTokenSource = new CancellationTokenSource(DefaultTimeoutMilliseconds * timeoutMultiplier);

        // Await the result of the Publish, otherwise the cancellation token source might be disposed prematurely.
        await publishEndpoint.PublishBatch(objs, cancellationTokenSource.Token);
    }
}