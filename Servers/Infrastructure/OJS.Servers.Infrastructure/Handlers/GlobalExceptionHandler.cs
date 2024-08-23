namespace OJS.Servers.Infrastructure.Handlers
{
    using Microsoft.AspNetCore.Diagnostics;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Hosting;
    using Microsoft.Extensions.Logging;
    using OJS.Common.Extensions;
    using OJS.Servers.Infrastructure.Extensions;
    using OJS.Services.Infrastructure.Exceptions;
    using OJS.Workers.Common.Extensions;
    using System;
    using System.Net;
    using System.Reflection;
    using System.Threading;
    using System.Threading.Tasks;
    using static OJS.Servers.Infrastructure.ServerConstants.ExceptionHandling;

    public class GlobalExceptionHandler(IHostEnvironment hostEnvironment, ILogger<GlobalExceptionHandler> logger)
        : IExceptionHandler
    {
        private const string StatusCodePropertyName = "StatusCode";
        private const string ExceptionAdditionalData = "data";

        public async ValueTask<bool> TryHandleAsync(
            HttpContext httpContext,
            Exception exception,
            CancellationToken cancellationToken)
        {
            exception.AddErrorCode();
            var errorCode = exception.GetErrorCode();
            var instanceId = Guid.NewGuid();

            logger.LogError(exception, "An error with code: {ErrorCode} and ID: {InstanceId} occurred", errorCode, instanceId);

            var problemDetails = new ProblemDetails
            {
                Instance = instanceId.ToString(),
                Extensions =
                {
                    [nameof(errorCode)] = errorCode,
                },
            };

            switch (exception)
            {
                case BadHttpRequestException badHttpRequestException:
                    this.HandleBadHttpRequest(httpContext, problemDetails, badHttpRequestException);
                    break;
                case BusinessServiceException businessException:
                    HandleValidationException(problemDetails, businessException);
                    break;
                default:
                    this.HandleException(httpContext, problemDetails, exception);
                    break;
            }

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
            BadHttpRequestException exception)
        {
            var status = (int?)typeof(BadHttpRequestException)
                .GetProperty(
                    StatusCodePropertyName,
                    BindingFlags.NonPublic | BindingFlags.Instance)
                ?.GetValue(exception);

            problemDetails.Title = BadHttpRequestExceptionTitle;
            problemDetails.Detail = this.GetSensitiveExceptionMessage(httpContext, exception);
            problemDetails.Status = status;
        }

        private void HandleException(
            HttpContext httpContext,
            ProblemDetails problemDetails,
            Exception exception)
        {
            problemDetails.Title = UnhandledExceptionTitle;
            problemDetails.Detail = this.GetSensitiveExceptionMessage(httpContext, exception);
            problemDetails.Status = (int)HttpStatusCode.InternalServerError;
        }

        private string GetSensitiveExceptionMessage(HttpContext httpContext, Exception exception)
            => hostEnvironment.IsDevelopment() || httpContext.User.IsAdmin()
                ? exception.GetAllMessages()
                : ExceptionDetailsForUnauthorized;
    }
}