namespace OJS.Servers.Administration.Middleware;

using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using OJS.Common.Exceptions;
using OJS.Common.Extensions;
using OJS.Workers.Common.Extensions;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;

public class AdministrationExceptionMiddleware : IMiddleware
{
    private readonly ILogger<AdministrationExceptionMiddleware> logger;

    public AdministrationExceptionMiddleware(ILogger<AdministrationExceptionMiddleware> logger)
        => this.logger = logger;

    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            ex.AddErrorCode();
            var errorCode = ex.GetErrorCode();
            var instanceId = Guid.NewGuid();
            this.logger.LogError(ex, "An error with code: {ErrorCode} and ID: {InstanceId} occurred", errorCode, instanceId);

            var message = context.User.IsAdmin()
                ? ex.GetAllMessages()
                : $"Oops! Something went wrong. Please report the code {errorCode} to an administrator.";

            var responseModel = new ExceptionResponseModel
            {
                Message = message,
                Name = $"Error with code: {errorCode} and ID: {instanceId}",
            };

            var jsonResponse = JsonSerializer.Serialize(new List<ExceptionResponseModel> { responseModel });

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            await context.Response.WriteAsync(jsonResponse);
        }
    }
}
