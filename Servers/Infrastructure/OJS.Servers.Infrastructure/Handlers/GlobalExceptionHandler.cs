namespace OJS.Servers.Infrastructure.Handlers;

using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using OJS.Common.Extensions;
using OJS.Servers.Infrastructure.Extensions;
using OJS.Services.Infrastructure.Constants;
using OJS.Services.Infrastructure.Exceptions;
using OJS.Workers.Common.Extensions;
using System;
using System.Globalization;
using System.Net;
using System.Reflection;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using static OJS.Servers.Infrastructure.ServerConstants.ExceptionHandling;

public class GlobalExceptionHandler(IHostEnvironment hostEnvironment, ILogger<GlobalExceptionHandler> logger)
    : IExceptionHandler
{
    private const string StatusCodePropertyName = "StatusCode";
    private const string ExceptionAdditionalData = "data";
    private readonly CompositeFormat exceptionDetailsForUnauthorized =
        CompositeFormat.Parse("Please use Instance ID: \"{0}\" and Error Code: \"{1}\" if reporting an issue.");

    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        exception.AddErrorCode();
        var errorCode = exception.GetErrorCode();
        var instanceId = Guid.NewGuid().ToString();

        logger.LogErrorWithCodeAndId(errorCode, instanceId, exception);

        var problemDetails = new ProblemDetails
        {
            Instance = instanceId,
            Extensions =
            {
                [nameof(errorCode)] = errorCode,
            },
        };

        switch (exception)
        {
            case BadHttpRequestException badHttpRequestException:
                this.HandleBadHttpRequest(httpContext, problemDetails, badHttpRequestException, instanceId, errorCode);
                break;
            case BusinessServiceException businessException:
                HandleValidationException(problemDetails, businessException);
                break;
            default:
                this.HandleException(httpContext, problemDetails, exception, instanceId, errorCode);
                break;
        }

        httpContext.Response.StatusCode = problemDetails.Status ?? (int)HttpStatusCode.InternalServerError;
        await httpContext.Response.WriteJson(problemDetails, cancellationToken);
        return true;
    }

    private static void HandleValidationException(
        ProblemDetails problemDetails,
        BusinessServiceException exception)
    {
        problemDetails.Title = ValidationExceptionTitle;
        problemDetails.Detail = exception.Message;
        problemDetails.Status = 422;
        problemDetails.Extensions[ExceptionAdditionalData] = exception.ParameterName;
    }

    private void HandleBadHttpRequest(
        HttpContext httpContext,
        ProblemDetails problemDetails,
        BadHttpRequestException exception,
        string instanceId,
        string? errorCode)
    {
        var status = (int?)typeof(BadHttpRequestException)
            .GetProperty(
                StatusCodePropertyName,
                BindingFlags.NonPublic | BindingFlags.Instance)
            ?.GetValue(exception);

        problemDetails.Title = BadHttpRequestExceptionTitle;
        problemDetails.Detail = this.GetSensitiveExceptionMessage(httpContext, exception, instanceId, errorCode);
        problemDetails.Status = status;
    }

    private void HandleException(
        HttpContext httpContext,
        ProblemDetails problemDetails,
        Exception exception,
        string instanceId,
        string? errorCode)
    {
        problemDetails.Title = UnhandledExceptionTitle;
        problemDetails.Detail = this.GetSensitiveExceptionMessage(httpContext, exception, instanceId, errorCode);
        problemDetails.Status = (int)HttpStatusCode.InternalServerError;
    }

    private string GetSensitiveExceptionMessage(HttpContext httpContext, Exception exception, string instanceId, string? errorCode)
        => hostEnvironment.IsDevelopment() || httpContext.User.IsAdmin()
            ? exception.GetAllMessages()
            : string.Format(CultureInfo.InvariantCulture, this.exceptionDetailsForUnauthorized, instanceId, errorCode);
}
