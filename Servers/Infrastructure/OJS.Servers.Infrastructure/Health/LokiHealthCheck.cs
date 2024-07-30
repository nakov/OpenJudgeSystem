namespace OJS.Servers.Infrastructure.Health;

using Microsoft.Extensions.Diagnostics.HealthChecks;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

public class LokiHealthCheck : IHealthCheck
{
    private readonly HttpClient client;

    public LokiHealthCheck(IHttpClientFactory clientFactory)
        => this.client = clientFactory.CreateClient(ServerConstants.LokiHttpClientName);

    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = new())
    {
        var res = await this.client.GetAsync("/ready", cancellationToken);
        var content = await res.Content.ReadAsStringAsync(cancellationToken);

        return res.IsSuccessStatusCode
            ? HealthCheckResult.Healthy(content)
            : HealthCheckResult.Unhealthy(content);
    }
}