namespace OJS.Servers.Administration.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Models.Contests;
using OJS.Services.Common.Data.Pagination;
using OJS.Services.Common.Models.Pagination;
using OJS.Data.Models.Contests;
using OJS.Services.Common.Data;
using Microsoft.EntityFrameworkCore;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System.Linq;
using OJS.Servers.Administration.Models;

[ApiController]
[Route("api/[controller]")]
//TODO Replace with admin authorization
[AllowAnonymous]
public class ContestController : ControllerBase
{
    private readonly IContestsBusinessService contestsBusinessServiceService;

    public ContestController(IContestsBusinessService contestsBusinessServiceService)
        => this.contestsBusinessServiceService = contestsBusinessServiceService;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery]PaginationRequestModel model)
    {
        var contest = await this.contestsBusinessServiceService.GetAll<ContestInListModel>(model);
        return this.Ok(contest);
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<IActionResult> ById(int id)
    {
        var contest = await this.contestsBusinessServiceService.ById(id);
        return this.Ok(contest);
    }

    [HttpGet]
    [Route("problems/{id}")]
    public async Task<IActionResult> Problems(int id)
    {
        var contest = await this.contestsBusinessServiceService.GetContestProblems(id);
        return this.Ok(contest);
    }
}