namespace OJS.Servers.Administration.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.ContestCategories;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System.Linq;
using OJS.Data.Models.Contests;
using OJS.Services.Common.Data.Pagination;

public class ContestCategoriesController : BaseAdminApiController<ContestCategory, ContestCategoriesInContestView>
{
    private readonly IContestCategoriesDataService contestCategoriesDataService;

    public ContestCategoriesController(
        IContestCategoriesDataService contestCategoriesDataService,
        IGridDataService<ContestCategory> contestCategoryGridDataService)
    : base(contestCategoryGridDataService)
        => this.contestCategoriesDataService = contestCategoriesDataService;

    [HttpGet]
    public IActionResult GetForContestDropdown()
        => this.Ok(
             this.contestCategoriesDataService
            .GetAllVisible()
            .ToHashSet()
            .MapCollection<ContestCategoriesInContestView>());
}