namespace OJS.Servers.Administration.Infrastructure.Filters
{
    using AutoCrudAdmin.Filters;
    using Microsoft.AspNetCore.Http;
    using OJS.Servers.Infrastructure.Extensions;

    public class AutoCrudAdminAuthFilter : IAutoCrudAuthFilter
    {
        public bool Authorize(HttpContext context)
            => true;
    }
}