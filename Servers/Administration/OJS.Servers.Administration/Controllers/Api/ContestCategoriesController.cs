namespace OJS.Servers.Administration.Controllers.Api;

using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using OJS.Data.Models.Contests;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Business.ContestCategories;
using OJS.Services.Administration.Business.ContestCategories.Validators;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.ContestCategories;
using OJS.Services.Administration.Models.Validation;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System.Linq;

public class ContestCategoriesController : BaseAdminApiController<ContestCategory, int, ContestCategoriesInContestView, ContestCategoriesAdministrationModel>
{
    private readonly IContestCategoriesDataService contestCategoriesDataService;

    public ContestCategoriesController(
        IContestCategoriesDataService contestCategoriesDataService,
        IGridDataService<ContestCategory> contestCategoryGridDataService,
        IContestCategoriesBusinessService contestCategoriesBusinessService,
        ContestCategoryAdministrationModelValidator validator,
        IValidator<BaseDeleteValidationModel<int>> deleteValidator,
        IPermissionsService<ContestCategoriesAdministrationModel, int> permissionsService)
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