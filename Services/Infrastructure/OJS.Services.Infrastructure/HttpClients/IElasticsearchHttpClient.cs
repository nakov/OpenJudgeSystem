namespace OJS.Services.Infrastructure.HttpClients;

using System.Threading;
using System.Threading.Tasks;

public interface IElasticsearchHttpClient
{
    public Task<(bool isHealthy, string? error)> IsHealthy(CancellationToken cancellationToken = default);
}