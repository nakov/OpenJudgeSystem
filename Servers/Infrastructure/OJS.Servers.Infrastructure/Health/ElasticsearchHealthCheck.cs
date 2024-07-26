namespace OJS.Servers.Infrastructure.Health;

using Microsoft.Extensions.Diagnostics.HealthChecks;
using OJS.Services.Infrastructure.HttpClients;
using System.Threading;
using System.Threading.Tasks;

public class ElasticsearchHealthCheck : IHealthCheck
{
    private readonly IElasticsearchHttpClient elasticsearchHttpClient;

    public ElasticsearchHealthCheck(IElasticsearchHttpClient elasticsearchHttpClient)
        => this.elasticsearchHttpClient = elasticsearchHttpClient;

    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = new())
    {
        var healthResult = await this.elasticsearchHttpClient.IsHealthy(cancellationToken);

        return healthResult.isHealthy
            ? HealthCheckResult.Healthy("Elasticsearch is healthy.")
            : HealthCheckResult.Unhealthy(healthResult.error);
    }
}