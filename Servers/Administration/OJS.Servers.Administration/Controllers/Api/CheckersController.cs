namespace OJS.Servers.Administration.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using OJS.Services.Administration.Data;
using OJS.Data.Models.Checkers;
using OJS.Services.Common.Data.Pagination;
public class CheckersController : BaseAdminApiController<Checker, Checker>
{
    private readonly ICheckersDataService checkersDataService;

    public CheckersController(
        ICheckersDataService checkersDataService,
        IGridDataService<Checker> checkerGridDataService)
    : base(checkerGridDataService)
        => this.checkersDataService = checkersDataService;

    [HttpGet]
    public IActionResult GetForProblems()
        => this.Ok(this.checkersDataService.GetAll());
}