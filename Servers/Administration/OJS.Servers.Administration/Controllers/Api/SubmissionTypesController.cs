namespace OJS.Servers.Administration.Controllers.Api;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OJS.Common;
using System.Threading.Tasks;
using OJS.Services.Administration.Business;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = GlobalConstants.Roles.AdministratorOrLecturer)]
public class SubmissionTypesController : ControllerBase
{
    private readonly ISubmissionTypesBusinessService submissionTypesBusinessService;

    public SubmissionTypesController(ISubmissionTypesBusinessService submissionTypesBusinessService)
        => this.submissionTypesBusinessService = submissionTypesBusinessService;

    [HttpGet]
    [Route("problemView")]
    public async Task<IActionResult> GetForProblem()
        => this.Ok(await this.submissionTypesBusinessService.GetForProblem());
}