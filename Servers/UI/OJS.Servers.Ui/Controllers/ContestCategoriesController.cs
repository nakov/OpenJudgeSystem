namespace OJS.Servers.Ui.Controllers;

using Microsoft.AspNetCore.Mvc;
using OJS.Servers.Infrastructure.Controllers;
using OJS.Servers.Infrastructure.Extensions;
using OJS.Services.Common.Models.Cache;
using OJS.Services.Ui.Business.Cache;
using System.Collections.Generic;
using System.Threading.Tasks;
using static Microsoft.AspNetCore.Http.StatusCodes;

public class ContestCategoriesController : BaseApiController
{
    private readonly IContestCategoriesCacheService contestCategoriesCache;

    public ContestCategoriesController(
        IContestCategoriesCacheService contestCategoriesCache)
        => this.contestCategoriesCache = contestCategoriesCache;

    /// <summary>
    /// Gets contest categories, ordered in a tree.
    /// </summary>
    /// <returns>All contest categories as a tree.</returns>
    /// <remarks>
    /// Retrieves the items from cache, that is invalidated every hour.
    /// </remarks>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<ContestCategoryTreeViewModel>), Status200OK)]
    public async Task<IActionResult> GetCategoriesTree()
        => await this.contestCategoriesCache
            .GetAllContestCategoriesTree()
            .ToOkResult();
}