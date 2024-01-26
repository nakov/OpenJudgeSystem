namespace OJS.Servers.Administration.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using OJS.Services.Administration.Data;

public class CheckersController : ApiControllerBase
{
    private readonly ICheckersDataService checkersDataService;

    public CheckersController(ICheckersDataService checkersDataService)
        => this.checkersDataService = checkersDataService;

    [HttpGet]
    [Route("forProblem")]
    public IActionResult GetForProblems()
        => this.Ok(this.checkersDataService.GetAll());
}