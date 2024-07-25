namespace OJS.Servers.Administration.Controllers;

using Microsoft.AspNetCore.Mvc;
using OJS.Data.Models.Contests;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Business.ContestCategories;
using OJS.Services.Administration.Business.ContestCategories.GridData;
using OJS.Services.Administration.Business.ContestCategories.Validators;
using OJS.Services.Administration.Models.ContestCategories;
using OJS.Services.Infrastructure.Extensions;
using System.Linq;

public class ContestCategoriesController : BaseAdminApiController<ContestCategory, int, ContestCategoryInListModel, ContestCategoryAdministrationModel>
{
    private readonly IContestCategoriesBusinessService contestCategoriesBusinessService;
    private readonly IContestCategoriesCacheService categoriesCacheService;

    public ContestCategoriesController(
        IContestCategoriesBusinessService contestCategoriesBusinessService,
        IContestCategoriesCacheService categoriesCacheService,
        ContestCategoryAdministrationModelValidator validator,
        IContestCategoriesGridDataService contestCategoryGridDataService)
    : base(
        contestCategoryGridDataService,
        contestCategoriesBusinessService,
        validator)
    {
        this.contestCategoriesBusinessService = contestCategoriesBusinessService;
        this.categoriesCacheService = categoriesCacheService;
    }

    [HttpGet]
    public IActionResult GetForContestDropdown()
        => this.Ok(
             this.contestCategoriesBusinessService
            .GetAllVisible()
            .Where(x => !x.IsDeleted)
            .ToHashSet()
            .MapCollection<ContestCategoriesInContestView>());
}