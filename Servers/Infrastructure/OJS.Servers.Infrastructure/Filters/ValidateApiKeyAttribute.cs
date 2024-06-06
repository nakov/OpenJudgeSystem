namespace OJS.Servers.Infrastructure.Filters;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Options;
using OJS.Services.Infrastructure.Configurations;

public class ValidateApiKeyAttribute : ActionFilterAttribute
{
    private const string ApiKeyParameterName = "apiKey";
    private readonly string validApiKey; // Replace with your valid API key

    public ValidateApiKeyAttribute(IOptions<ApplicationUrlsConfig> appUrlsOptions)
        => this.validApiKey = appUrlsOptions.Value.ApiKey;

    public override void OnActionExecuting(ActionExecutingContext context)
    {
        if (!context.HttpContext.Request.Query.TryGetValue(ApiKeyParameterName, out var extractedApiKey))
        {
            context.Result = new ContentResult()
            {
                StatusCode = 401,
                Content = "API Key is missing",
            };

            return;
        }

        if (!this.validApiKey.Equals(extractedApiKey))
        {
            context.Result = new ContentResult()
            {
                StatusCode = 403,
                Content = "Invalid API key.",
            };

            return;
        }

        base.OnActionExecuting(context);
    }
}