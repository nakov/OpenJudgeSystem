namespace OJS.Servers.Administration.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Models.ContestCategories;
using OJS.Services.Common.Models.Pagination;
using System.Threading.Tasks;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System.Linq;

public class ContestCategoriesController : ApiControllerBase
{
    private readonly IContestCategoriesBusinessService categoriesBusinessService;

    public ContestCategoriesController(
        IContestCategoriesBusinessService categoriesBusinessService) =>
        this.categoriesBusinessService = categoriesBusinessService;

    [HttpGet]
    [Route("dropdown")]
    public IActionResult GetForContestDropdown()
        => this.Ok(
             this.categoriesBusinessService
            .GetAllVisible()
            .ToHashSet()
            .MapCollection<ContestCategoriesInContestView>());

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery]PaginationRequestModel model)
    {
        var contestsCategories = await this.categoriesBusinessService.GetAll<ContestCategoryInListModel>(model);
        return this.Ok(contestsCategories);
    }
}