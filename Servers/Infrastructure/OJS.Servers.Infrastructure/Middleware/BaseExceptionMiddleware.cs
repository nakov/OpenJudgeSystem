namespace OJS.Servers.Infrastructure.Middleware
{
    using Microsoft.AspNetCore.Diagnostics;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Logging;
    using OJS.Servers.Infrastructure.Extensions;
    using OJS.Services.Infrastructure.Exceptions;
    using OJS.Workers.Common.Extensions;
    using System;
    using System.Net;
    using System.Reflection;
    using static OJS.Servers.Infrastructure.ServerConstants.ExceptionHandling;

    public abstract class BaseExceptionMiddleware
    {
        private const string StatusCodePropertyName = "StatusCode";
        private const string ExceptionAdditionalData = "data";

        public RequestDelegate Get =>
            async httpContext =>
            {
                var errorFeature = httpContext.Features.Get<IExceptionHandlerFeature>();
                var exception = errorFeature
                    ?.Error ?? new Exception($"Cannot get exception from {nameof(IExceptionHandlerFeature)}");

                exception.AddErrorCode();
                var errorCode = exception.GetErrorCode();
                var instanceId = Guid.NewGuid();

                var logger = httpContext.RequestServices.GetRequiredService<ILogger<BaseExceptionMiddleware>>();
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
                        this.HandleValidationException(problemDetails, businessException);
                        break;
                    default:
                        this.HandleException(httpContext, problemDetails, exception);
                        break;
                }

                httpContext.Response.StatusCode = problemDetails.Status ?? 500;
                await httpContext.Response.WriteJson(problemDetails);
            };

        protected virtual void HandleBadHttpRequest(
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
            problemDetails.Status = status;
        }

        protected virtual void HandleValidationException(
            ProblemDetails problemDetails,
            BusinessServiceException exception)
        {
            problemDetails.Title = ValidationExceptionTitle;
            problemDetails.Detail = exception.Message;
            problemDetails.Status = 422;
            problemDetails.Extensions[ExceptionAdditionalData] = exception.ParameterName;
        }

        protected virtual void HandleException(
            HttpContext httpContext,
            ProblemDetails problemDetails,
            Exception exception)
        {
            problemDetails.Title = UnhandledExceptionTitle;
            problemDetails.Status = (int)HttpStatusCode.InternalServerError;
        }
    }
}