namespace OJS.Servers.Infrastructure.Extensions;

using Microsoft.AspNetCore.Mvc.Rendering;

public static class ViewContextExtensions
{
    public static string GetReturnUrl(this ViewContext viewContext)
        => viewContext.HttpContext.GetReturnUrl();
}