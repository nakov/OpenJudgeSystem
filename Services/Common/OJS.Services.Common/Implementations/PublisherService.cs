namespace OJS.Services.Common.Implementations;

using MassTransit;

public class PublisherService : IPublisherService
{
    private readonly IBus bus;

    public PublisherService(IBus bus)
        => this.bus = bus;

    public void Publish<T>(T obj)
        where T : class
        => this.bus.Publish(obj);
}