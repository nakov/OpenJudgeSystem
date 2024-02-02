namespace OJS.Servers.Administration.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using OJS.Data.Models.Checkers;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Business.Checkers;
using OJS.Services.Administration.Business.Checkers.Validators;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.Validation;
using OJS.Services.Common.Data.Pagination;

public class CheckersController : BaseAdminApiController<Checker, Checker, Checker>
{
    private readonly ICheckersDataService checkersDataService;

    public CheckersController(
        ICheckersDataService checkersDataService,
        IGridDataService<Checker> checkerGridDataService,
        ICheckersBusinessService checkersBusinessService,
        CheckerAdministrationModelValidator validator,
        CheckerDeleteValidator deleteValidator)
    : base(
        checkerGridDataService,
        checkersBusinessService,
        validator,
        deleteValidator)
        => this.checkersDataService = checkersDataService;

    [HttpGet]
    public IActionResult GetForProblems()
        => this.Ok(this.checkersDataService.GetAll());
}