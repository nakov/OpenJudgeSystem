namespace OJS.Servers.Administration.Filters
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