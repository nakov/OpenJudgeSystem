namespace OJS.Servers.Infrastructure.Middleware
{
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;
    using System;
    using OJS.Common.Extensions;
    using static OJS.Servers.Infrastructure.ServerConstants.ExceptionHandling;

    public class Rfc7807ExceptionMiddleware : BaseExceptionMiddleware
    {
        protected override void HandleBadHttpRequest(
            HttpContext httpContext,
            ProblemDetails problemDetails,
            BadHttpRequestException exception)
        {
            base.HandleBadHttpRequest(httpContext, problemDetails, exception);

            problemDetails.Detail = httpContext.User.IsAdmin()
                ? exception.Message
                : ExceptionDetailsForUnauthorized;
        }

        protected override void HandleException(
            HttpContext httpContext,
            ProblemDetails problemDetails,
            Exception exception)
        {
            base.HandleException(httpContext, problemDetails, exception);
            var details = httpContext.User.IsAdmin()
                ? exception
                    .GetBaseException()
                    .Message
                : ExceptionDetailsForUnauthorized;

            problemDetails.Detail = details;
        }
    }
}