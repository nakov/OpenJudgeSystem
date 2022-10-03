namespace OJS.Servers.Infrastructure.Middleware
{
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;
    using System;

    public class DevelopmentExceptionMiddleware : BaseExceptionMiddleware
    {
        protected override void HandleBadHttpRequest(
            HttpContext httpContext,
            ProblemDetails problemDetails,
            BadHttpRequestException exception)
        {
            base.HandleBadHttpRequest(httpContext, problemDetails, exception);

            problemDetails.Detail = exception.Message;
        }

        protected override void HandleException(HttpContext httpContext, ProblemDetails problemDetails,
            Exception exception)
        {
            base.HandleException(
                httpContext,
                problemDetails,
                exception);

            problemDetails.Detail = exception.GetBaseException().Message;
        }
    }
}

