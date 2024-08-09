namespace OJS.Servers.Infrastructure.Handlers;

using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using OJS.Servers.Infrastructure.Policy;
using OJS.Services.Infrastructure.Configurations;
using System;
using static OJS.Servers.Infrastructure.ServerConstants;

public class ApiKeyHandler(
    IHttpContextAccessor httpContextAccessor,
    IOptions<ApplicationConfig> configurationAccessor)
    : AuthorizationHandler<ApiKeyRequirement>
{
    private readonly ApplicationConfig settings = configurationAccessor.Value;

    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, ApiKeyRequirement requirement)
    {
        var httpContext = httpContextAccessor.HttpContext;

        if (httpContext == null)
        {
            context.Fail();
            return Task.CompletedTask;
        }

        string? apiKey;

        if (httpContext.Request.Headers.TryGetValue(requirement.HeaderName, out var headerApiKey))
        {
            apiKey = headerApiKey;
        }
        else if (httpContext.Request.Query.TryGetValue(UrlParameters.ApiKey, out var queryApiKey))
        {
            // Query parameters are not recommended for API keys, but we support them for now, as suls platform uses them.
            apiKey = queryApiKey;
        }
        else
        {
            apiKey = null;
        }

        if (this.settings.ApiKey.Equals(apiKey, StringComparison.Ordinal))
        {
            context.Succeed(requirement);
        }
        else if (apiKey != null)
        {
            context.Fail(new AuthorizationFailureReason(this, "Invalid API key provided."));
        }
        else
        {
            context.Fail(new AuthorizationFailureReason(this, "API key not provided."));
        }

        return Task.CompletedTask;
    }
}
