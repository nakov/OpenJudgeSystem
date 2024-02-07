namespace OJS.Servers.Administration.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using OJS.Data.Models.Contests;
using OJS.Services.Administration.Business.ContestCategories;
using OJS.Services.Administration.Business.ContestCategories.Permissions;
using OJS.Services.Administration.Business.ContestCategories.Validators;
using OJS.Services.Administration.Models.ContestCategories;
using OJS.Services.Common.Data.Pagination;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System.Linq;

public class ContestCategoriesController : BaseAdminApiController<ContestCategory, ContestCategoryInListModel, ContestCategoryAdministrationModel>
{
    private readonly IContestCategoriesBusinessService contestCategoriesBusinessService;

    public ContestCategoriesController(
        IContestCategoriesBusinessService contestCategoriesBusinessService,
        ContestCategoryAdministrationModelValidator validator,
        IGridDataService<ContestCategory> contestCategoryGridDataService,
        ContestCategoryDeleteValidator deleteValidator,
        IContestCategoriesPermissionsService permissionsService)
    : base(
        contestCategoryGridDataService,
        contestCategoriesBusinessService,
        validator,
        deleteValidator,
        permissionsService)
        => this.contestCategoriesBusinessService = contestCategoriesBusinessService;

    [HttpGet]
    public IActionResult GetForContestDropdown()
        => this.Ok(
             this.contestCategoriesBusinessService
            .GetAllVisible()
            .ToHashSet()
            .MapCollection<ContestCategoriesInContestView>());
}