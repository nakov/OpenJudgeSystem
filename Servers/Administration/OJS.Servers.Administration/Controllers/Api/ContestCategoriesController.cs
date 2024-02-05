namespace OJS.Servers.Administration.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using OJS.Data.Models.Contests;
using OJS.Services.Administration.Business.ContestCategories;
using OJS.Services.Administration.Business.ContestCategories.Permissions;
using OJS.Services.Administration.Business.ContestCategories.Validators;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Models.ContestCategories;
using OJS.Services.Common.Data.Pagination;
using OJS.Services.Common.Models.Pagination;
using System.Threading.Tasks;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System.Linq;

public class ContestCategoriesController : BaseAdminApiController<ContestCategory, ContestCategoriesInContestView, ContestCategoriesAdministrationModel>
{
    private readonly IContestCategoriesDataService contestCategoriesDataService;
    private readonly IContestCategoriesBusinessService categoriesBusinessService;

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

    [HttpPost]
    public async Task<IActionResult> Create(ContestCategoryAdministrationModel model)
    {
        // var validations = await this.validationService.ValidateAsync(this.validator, model);
        //
        // if (validations.Errors.Any())
        // {
        //     return this.UnprocessableEntity(validations.Errors);
        // }

        await this.categoriesBusinessService.Create(model);
        return this.Ok("Contest Category created successfully.");
    }

    [HttpGet]
    [Route("GetById/{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        // if (!await this.HasContestPermission(id))
        // {
        //     return this.Unauthorized();
        // }

        var contest = await this.categoriesBusinessService.GetById(id);
        return this.Ok(contest);
    }

    [HttpPatch]
    [Route("{id}")]
    public async Task<IActionResult> Update(ContestCategoryAdministrationModel model, [FromRoute] int id)
    {
        model.Id = id;

        // var validations = await this.validationService.ValidateAsync(this.validator, model);
        //
        // if (validations.Errors.Any())
        // {
        //     return this.UnprocessableEntity(validations.Errors);
        // }

        await this.categoriesBusinessService.Edit(model, id);

        return this.Ok("Contest was successfully updated.");
    }
}