namespace OJS.Servers.Administration.Infrastructure.Filters
{
    using AutoCrudAdmin.Filters;
    using Microsoft.AspNetCore.Http;
    using OJS.Common.Extensions;

    public class AutoCrudAdminAuthFilter : IAutoCrudAuthFilter
    {
        public bool Authorize(HttpContext context)
            => context.User.IsAdminOrLecturer();
    }
}