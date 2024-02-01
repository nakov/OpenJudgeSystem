namespace OJS.Servers.Administration.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using OJS.Services.Administration.Business;

public class SubmissionTypesController : ApiControllerBase
{
    private readonly ISubmissionTypesBusinessService submissionTypesBusinessService;

    public SubmissionTypesController(ISubmissionTypesBusinessService submissionTypesBusinessService)
        => this.submissionTypesBusinessService = submissionTypesBusinessService;

    [HttpGet]
    [Route("problemView")]
    public async Task<IActionResult> GetForProblem()
        => this.Ok(await this.submissionTypesBusinessService.GetForProblem());
}