namespace OJS.Servers.Ui.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using OJS.Services.Ui.Business;
using System.Threading.Tasks;

public class ContestCategoriesController : ControllerBase
{
    private readonly IContestCategoriesBusinessService contestCategoriesBusiness;

    public ContestCategoriesController(
        IContestCategoriesBusinessService contestCategoriesBusiness)
        => this.contestCategoriesBusiness = contestCategoriesBusiness;

    public async Task<IActionResult> GetCategoriesTree()
        => this.Ok(await this.contestCategoriesBusiness.GetTree());

    public async Task<IActionResult> GetMainCategories()
        => this.Ok(await this.contestCategoriesBusiness.GetAllMain());

    public async Task<IActionResult> GetSubcategories(int id)
        => this.Ok(await this.contestCategoriesBusiness.GetAllSubcategories(id));

    public async Task<IActionResult> GetParentCategories(int id)
        => this.Ok(await this.contestCategoriesBusiness.GetAllParentCategories(id));
}