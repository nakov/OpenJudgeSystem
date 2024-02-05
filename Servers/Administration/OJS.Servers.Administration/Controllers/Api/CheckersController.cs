namespace OJS.Servers.Administration.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using OJS.Data.Models.Checkers;
using OJS.Services.Administration.Business.Checkers;
using OJS.Services.Administration.Business.Checkers.Permissions;
using OJS.Services.Administration.Business.Checkers.Validators;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.Checkers;
using OJS.Services.Common.Data.Pagination;

public class CheckersController : BaseAdminApiController<Checker, Checker, CheckerAdministrationModel>
{
    private readonly ICheckersDataService checkersDataService;

    public CheckersController(
        ICheckersDataService checkersDataService,
        IGridDataService<Checker> checkerGridDataService,
        ICheckersBusinessService checkersBusinessService,
        CheckerAdministrationModelValidator validator,
        CheckerDeleteValidator deleteValidator,
        ICheckersPermissionService permissionService)
    : base(
        checkerGridDataService,
        checkersBusinessService,
        validator,
        deleteValidator,
        permissionService)
        => this.checkersDataService = checkersDataService;

    [HttpGet]
    public IActionResult GetForProblems()
        => this.Ok(this.checkersDataService.GetAll());
}