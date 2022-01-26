namespace OJS.Servers.Infrastructure.Middleware
{
    using Microsoft.AspNetCore.Diagnostics;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;
    using OJS.Common.Extensions;
    using OJS.Servers.Infrastructure.Extensions;
    using OJS.Services.Infrastructure.Exceptions;
    using System;
    using System.Net;
    using System.Reflection;
    using static OJS.Servers.Infrastructure.ServerConstants.ExceptionHandling;

    public class Rfc7807ExceptionMiddleware
    {
        private const string StatusCodePropertyName = "StatusCode";

        public static RequestDelegate Get =>
            async httpContext =>
            {
                var errorFeature = httpContext.Features.Get<IExceptionHandlerFeature>();
                var exception = errorFeature
                    ?.Error ?? new Exception($"Cannot get exception from {nameof(IExceptionHandlerFeature)}");

                var instanceId = Guid.NewGuid();
                var problemDetails = new ProblemDetails { Instance = instanceId.ToString() };

                switch (exception)
                {
                    case BadHttpRequestException badHttpRequestException:
                        HandleBadHttpRequest(httpContext, problemDetails, badHttpRequestException);
                        break;
                    case BusinessServiceException businessException:
                        HandleValidationException(problemDetails, businessException);
                        break;
                    default:
                        HandleException(httpContext, problemDetails, exception);
                        break;
                }

                httpContext.Response.StatusCode = problemDetails.Status ?? 500;
                await httpContext.Response.WriteJson(problemDetails);
            };

        private static void HandleBadHttpRequest(
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
            problemDetails.Detail = httpContext.User.IsAdmin()
                ? exception.Message
                : ExceptionDetailsForUnauthorized;
            problemDetails.Status = status;
        }

        private static void HandleValidationException(
            ProblemDetails problemDetails,
            BusinessServiceException exception)
        {
            problemDetails.Title = ValidationExceptionTitle;
            problemDetails.Detail = exception.Message;
            problemDetails.Status = 422;
        }

        private static void HandleException(
            HttpContext httpContext,
            ProblemDetails problemDetails,
            Exception exception)
        {
            var details = httpContext.User.IsAdmin()
                ? exception
                    .GetBaseException()
                    .Message
                : ExceptionDetailsForUnauthorized;

            problemDetails.Title = UnhandledExceptionTitle;
            problemDetails.Status = (int)HttpStatusCode.InternalServerError;
            problemDetails.Detail = details;
        }
    }
}