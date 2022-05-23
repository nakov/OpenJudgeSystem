namespace OJS.Servers.Ui.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using OJS.Services.Ui.Business;
using System.Threading.Tasks;

public class ContestCategoriesController : ControllerBase
{
    private readonly IContestCategoriesCacheService contestCategoriesCache;

    public ContestCategoriesController(
        IContestCategoriesCacheService contestCategoriesCache)
        => this.contestCategoriesCache = contestCategoriesCache;

    public async Task<IActionResult> GetCategoriesTree()
        => this.Ok(await this.contestCategoriesCache.GetAllContestCategoriesTree());

    public async Task<IActionResult> GetMainCategories()
        => this.Ok(await this.contestCategoriesCache.GetMainContestCategories());

    public async Task<IActionResult> GetSubcategories(int id)
        => this.Ok(await this.contestCategoriesCache.GetContestSubCategoriesList(id));

    public async Task<IActionResult> GetParentCategories(int id)
        => this.Ok(await this.contestCategoriesCache.GetContestCategoryParentsList(id));
}