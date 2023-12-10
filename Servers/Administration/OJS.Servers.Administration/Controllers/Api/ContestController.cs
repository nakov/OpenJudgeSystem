namespace OJS.Servers.Administration.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using OJS.Data.Models.Contests;
using OJS.Services.Infrastructure.Pagination;
using Microsoft.AspNetCore.Authorization;
using OJS.Services.Administration.Business;

[ApiController]
[Route("api/[controller]")]
//TODO Replace with admin authorization
[AllowAnonymous]
public class ContestController : ControllerBase
{
    private readonly IContestsBusinessService contestsBusinessServiceService;

    public ContestController(IContestsBusinessService contestsBusinessServiceService) => this.contestsBusinessServiceService = contestsBusinessServiceService;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery]PaginationModel<Contest> paginationModel)
    {
        var contest = await this.contestsBusinessServiceService.GetAllContests(paginationModel);
        return this.Ok(contest);
    }
}