namespace OJS.Servers.Administration.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using OJS.Services.Common.Models.Pagination;
using System.Threading.Tasks;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Models.Problems;
using OJS.Common.Exceptions;
using Microsoft.AspNetCore.Authorization;
using OJS.Common;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = GlobalConstants.Roles.AdministratorOrLecturer)]
public class ProblemsController : ControllerBase
{
    private readonly IProblemsBusinessService problemsBusinessService;

    public ProblemsController(IProblemsBusinessService problemsBusinessService)
        => this.problemsBusinessService = problemsBusinessService;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery]PaginationRequestModel model)
    {
        var problems = await this.problemsBusinessService.GetAll<ProblemsInListModel>(model);
        return this.Ok(problems);
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<IActionResult> ById([FromRoute] int id)
    {
        if (id <= 0)
        {
            return this.BadRequest(new ExceptionResponseModel(id.ToString(), "Invalid problem id"));
        }

        var problem = await this.problemsBusinessService.ById(id);

        return this.Ok(problem);
    }
}