namespace OJS.Servers.Administration.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using OJS.Data.Models.Contests;
using OJS.Services.Administration.Business.ContestCategories;
using OJS.Services.Administration.Business.ContestCategories.Permissions;
using OJS.Services.Administration.Business.ContestCategories.Validators;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.ContestCategories;
using OJS.Services.Common.Data.Pagination;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System.Linq;

public class ContestCategoriesController : BaseAdminApiController<ContestCategory, ContestCategoriesInContestView, ContestCategoriesAdministrationModel>
{
    private readonly IContestCategoriesDataService contestCategoriesDataService;

    public ContestCategoriesController(
        IContestCategoriesDataService contestCategoriesDataService,
        IGridDataService<ContestCategory> contestCategoryGridDataService,
        IContestCategoriesBusinessService contestCategoriesBusinessService,
        ContestCategoryAdministrationModelValidator validator,
        ContestCategoryDeleteValidator deleteValidator,
        IContestCategoriesPermissionsService permissionsService)
    : base(
        contestCategoryGridDataService,
        contestCategoriesBusinessService,
        validator,
        deleteValidator,
        permissionsService)
        => this.contestCategoriesDataService = contestCategoriesDataService;

    [HttpGet]
    public IActionResult GetForContestDropdown()
        => this.Ok(
             this.contestCategoriesDataService
            .GetAllVisible()
            .ToHashSet()
            .MapCollection<ContestCategoriesInContestView>());
}