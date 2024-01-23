namespace OJS.Servers.Administration.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using OJS.Common.Enumerations;
using System;
using System.Linq;

public class ProblemGroupsController : ApiControllerBase
{
    [HttpGet]
    [Route("forProblem")]
    public IActionResult GetForProblem() =>
        this.Ok(Enum.GetNames(typeof(ProblemGroupType)).ToList());
}