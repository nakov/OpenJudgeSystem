namespace OJS.Servers.Administration.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Models.Contests;
using OJS.Services.Common.Models.Pagination;
using System.Linq;
using OJS.Services.Common.Validation;
using OJS.Services.Administration.Models.Contests.Problems;

public class SubmissionsController : ApiControllerBase
{
    private readonly ISubmissionsBusinessService submissionsBusinessService;

    public SubmissionsController(ISubmissionsBusinessService submissionsBusinessService)
        => this.submissionsBusinessService = submissionsBusinessService;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery]PaginationRequestModel model)
    {
        var contest = await this.submissionsBusinessService.<ContestInListModel>(model);
        return this.Ok(contest);
    }
}