namespace OJS.Web.Infrastructure.Filters
{
    using System.Web.Mvc;

    using OJS.Common.Constants;
    using OJS.Services.Cache;
    using OJS.Web.Infrastructure.Filters.Attributes;
    using OJS.Web.Infrastructure.Filters.Contracts;

    public class ClearMainContestCategoriesCacheFilter : IActionFilter<ClearMainContestCategoriesCacheAttribute>
    {
        private readonly IRedisCacheService redisCacheService;

        public ClearMainContestCategoriesCacheFilter(IRedisCacheService redisCacheService)
        {
            this.redisCacheService = redisCacheService;
        }

        public void OnActionExecuting(
            ClearMainContestCategoriesCacheAttribute attribute,
            ActionExecutingContext filterContext)
        {
        }

        public void OnActionExecuted(
            ClearMainContestCategoriesCacheAttribute attribute,
            ActionExecutedContext filterContext)
        {
            this.redisCacheService.Remove(CacheConstants.MainContestCategoriesDropDown);
            this.redisCacheService.Remove(CacheConstants.ContestCategoriesTree);
        }
    }
}