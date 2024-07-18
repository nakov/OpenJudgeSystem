namespace OJS.Servers.Administration.Controllers;

using Microsoft.AspNetCore.Mvc;
using OJS.Data.Models.Checkers;
using OJS.Services.Administration.Business.Checkers;
using OJS.Services.Administration.Business.Checkers.Validators;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.Checkers;

public class CheckersController : BaseAdminApiController<Checker, int, CheckerInListModel, CheckerAdministrationModel>
{
    private readonly ICheckersDataService checkersDataService;

    public CheckersController(
        ICheckersDataService checkersDataService,
        IGridDataService<Checker> checkerGridDataService,
        ICheckersBusinessService checkersBusinessService,
        CheckerAdministrationModelValidator validator)
    : base(
        checkerGridDataService,
        checkersBusinessService,
        validator)
        => this.checkersDataService = checkersDataService;

    [HttpGet]
    public IActionResult GetForProblems()
        => this.Ok(this.checkersDataService.GetQuery());
}