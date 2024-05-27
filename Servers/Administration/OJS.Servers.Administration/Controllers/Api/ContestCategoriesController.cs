namespace OJS.Servers.Administration.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using OJS.Data.Models.Contests;
using OJS.Servers.Administration.Attributes;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Business.ContestCategories;
using OJS.Services.Administration.Business.ContestCategories.GridData;
using OJS.Services.Administration.Business.ContestCategories.Validators;
using OJS.Services.Administration.Models;
using OJS.Services.Administration.Models.ContestCategories;
using OJS.Services.Infrastructure.Extensions;
using System.Linq;
using System.Threading.Tasks;

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

    [HttpDelete("{id}")]
    [ProtectedEntityAction("id", AdministrationConstants.AdministrationOperations.Delete)]
    public override async Task<IActionResult> Delete(int id)
    {
        var result = await base.Delete(id);

        if (result is OkObjectResult)
        {
            this.categoriesCacheService.ClearMainContestCategoriesCache();
        }

        return result;
    }
}