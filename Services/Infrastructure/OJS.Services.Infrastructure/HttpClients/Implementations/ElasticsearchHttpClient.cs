namespace OJS.Services.Infrastructure.HttpClients.Implementations;

using Elastic.Clients.Elasticsearch;
using Elastic.Transport.Products.Elasticsearch;
using OJS.Workers.Common.Extensions;
using System.Threading;
using System.Threading.Tasks;

public class ElasticsearchHttpClient : IElasticsearchHttpClient
{
    private readonly ElasticsearchClient client;

    public ElasticsearchHttpClient(ElasticsearchClient client)
        => this.client = client;

    public async Task<(bool isHealthy, string? error)> IsHealthy(CancellationToken cancellationToken = default)
    {
        string? error = null;
        var response = await this.client.PingAsync(cancellationToken);
        var isHealthy = response.IsValidResponse;
        if (!isHealthy)
        {
            error = response.TryGetElasticsearchServerError(out var serverError)
                ? serverError.Error.Reason
                : response.TryGetOriginalException(out var exception)
                    ? exception?.GetAllMessages() ?? "Unknown error"
                    : response.ToString();
        }

        return (isHealthy, error);
    }
}