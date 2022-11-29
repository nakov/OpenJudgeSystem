namespace OJS.Servers.Ui.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using OJS.Servers.Infrastructure.Extensions;
using OJS.Services.Common.Models.Cache;
using OJS.Services.Ui.Business;
using System.Collections.Generic;
using System.Threading.Tasks;
using static Microsoft.AspNetCore.Http.StatusCodes;

public class ContestCategoriesController : BaseApiController
{
    private readonly IContestCategoriesCacheService contestCategoriesCache;
    private readonly IContestCategoriesBusinessService contestCategoriesBusiness;

    public ContestCategoriesController(
        IContestCategoriesCacheService contestCategoriesCache, IContestCategoriesBusinessService contestCategoriesBusiness)
    {
        this.contestCategoriesCache = contestCategoriesCache;
        this.contestCategoriesBusiness = contestCategoriesBusiness;
    }

    /// <summary>
    /// Gets contest categories, ordered in a tree.
    /// </summary>
    /// <returns>All contest categories as a tree</returns>
    /// <remarks>
    /// Retrieves the items from cache, that is invalidated every hour.
    /// </remarks>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<ContestCategoryTreeViewModel>), Status200OK)]
    public async Task<IActionResult> GetCategoriesTree()
        // => await this.contestCategoriesCache
        //     .GetAllContestCategoriesTree()
        //     .ToOkResult();
        => await contestCategoriesBusiness.GetTree()
            .ToOkResult();
}