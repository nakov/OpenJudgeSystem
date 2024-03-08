namespace OJS.Servers.Administration.Controllers.Api;

using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using OJS.Data.Models.Contests;
using OJS.Services.Administration.Business.ContestCategories;
using OJS.Services.Administration.Business.ContestCategories.GridData;
using OJS.Services.Administration.Business.ContestCategories.Validators;
using OJS.Services.Administration.Models.ContestCategories;
using OJS.Services.Administration.Models.Validation;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System.Linq;

public class ContestCategoriesController : BaseAdminApiController<ContestCategory, int, ContestCategoryInListModel, ContestCategoryAdministrationModel>
{
    private readonly IContestCategoriesBusinessService contestCategoriesBusinessService;

    public ContestCategoriesController(
        IContestCategoriesBusinessService contestCategoriesBusinessService,
        ContestCategoryAdministrationModelValidator validator,
        IContestCategoriesGridDataService contestCategoryGridDataService,
        IValidator<BaseDeleteValidationModel<int>> deleteValidator)
    : base(
        contestCategoryGridDataService,
        contestCategoriesBusinessService,
        validator,
        deleteValidator)
        => this.contestCategoriesBusinessService = contestCategoriesBusinessService;

    [HttpGet]
    public IActionResult GetForContestDropdown()
        => this.Ok(
             this.contestCategoriesBusinessService
            .GetAllVisible()
            .ToHashSet()
            .MapCollection<ContestCategoriesInContestView>());
}