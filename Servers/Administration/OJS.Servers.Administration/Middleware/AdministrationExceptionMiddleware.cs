namespace OJS.Servers.Administration.Middleware;

using Microsoft.AspNetCore.Http;
using OJS.Common.Exceptions;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;

public class AdministrationExceptionMiddleware
{
    private readonly RequestDelegate next;
    public AdministrationExceptionMiddleware(RequestDelegate next)
        => this.next = next;

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await this.next(context);
        }
        catch (Exception ex)
        {
            var responseModel = new ExceptionResponseModel();
            responseModel.Message = ex.Message;
            var jsonResponse = JsonSerializer.Serialize(new List<ExceptionResponseModel> { responseModel });

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            await context.Response.WriteAsync(jsonResponse);
        }
    }
}
