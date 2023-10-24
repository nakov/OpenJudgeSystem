namespace OJS.Servers.Infrastructure.Checks;

using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Http;
using System.Threading;
using System.Threading.Tasks;

public class HealthCheck : IHealthCheck
{
    private const string QueryStringPasswordKey = "p433w0rd";
    private const string QueryStringPasswordValue = "h34lth-m0n1t0r1ng";

    private readonly IHttpContextAccessor httpContextAccessor;

    public HealthCheck(IHttpContextAccessor httpContextAccessor) => this.httpContextAccessor = httpContextAccessor;

    public Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
    {
            var httpContext = this.httpContextAccessor.HttpContext;
            var query = httpContext!.Request.Query;
            if (query.ContainsKey(QueryStringPasswordKey))
            {
                var value = query[QueryStringPasswordKey];
                if (value == QueryStringPasswordValue)
                {
                    return Task.FromResult(HealthCheckResult.Healthy());
                }
            }

            return Task.FromResult(HealthCheckResult.Unhealthy());
    }
}