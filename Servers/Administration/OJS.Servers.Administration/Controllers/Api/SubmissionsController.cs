namespace OJS.Servers.Administration.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Models.Submissions;
using OJS.Services.Common.Models.Pagination;

public class SubmissionsController : ApiControllerBase
{
    private readonly ISubmissionsBusinessService submissionsBusinessService;

    public SubmissionsController(ISubmissionsBusinessService submissionsBusinessService)
        => this.submissionsBusinessService = submissionsBusinessService;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery]PaginationRequestModel model)
    {
        var contest = await this.submissionsBusinessService
            .GetAll<SubmissionAdministrationServiceModel>(model);

        return this.Ok(contest);
    }

    [Route("/retest/{id}")]
    public async Task<IActionResult> Retest([FromQuery] int id) => await Task.FromResult(this.Ok(id));
}