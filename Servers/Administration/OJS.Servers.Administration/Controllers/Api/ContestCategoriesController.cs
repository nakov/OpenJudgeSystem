namespace OJS.Servers.Administration.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.ContestCategories;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System.Linq;
using OJS.Data.Models.Contests;
using OJS.Services.Common.Data.Pagination;
using OJS.Services.Administration.Business.ContestCategories;
using OJS.Services.Administration.Business.ContestCategories.Validators;
using OJS.Services.Common.Validation;

public class ContestCategoriesController : BaseAdminApiController<ContestCategory, ContestCategoriesInContestView, ContestCategory>
{
    private readonly IContestCategoriesDataService contestCategoriesDataService;

    public ContestCategoriesController(
        IContestCategoriesDataService contestCategoriesDataService,
        IGridDataService<ContestCategory> contestCategoryGridDataService,
        IContestCategoriesBusinessService contestCategoriesBusinessService,
        ContestCategoryAdministrationModelValidator validator)
    : base(
        contestCategoryGridDataService,
        contestCategoriesBusinessService,
        validator)
        => this.contestCategoriesDataService = contestCategoriesDataService;

    [HttpGet]
    public IActionResult GetForContestDropdown()
        => this.Ok(
             this.contestCategoriesDataService
            .GetAllVisible()
            .ToHashSet()
            .MapCollection<ContestCategoriesInContestView>());
}