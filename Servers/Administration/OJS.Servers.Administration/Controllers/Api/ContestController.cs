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
    private readonly IDataService<Contest> contestsDataService;

    public ContestController(IContestsBusinessService contestsBusinessServiceService, IDataService<Contest> contestsDataService)
    {
        this.contestsBusinessServiceService = contestsBusinessServiceService;
        this.contestsDataService = contestsDataService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery]PaginationRequestModel model)
    {
        var contest = await this.contestsBusinessServiceService.GetAll<ContestInListModel>(model);
        return this.Ok(contest);
    }
}