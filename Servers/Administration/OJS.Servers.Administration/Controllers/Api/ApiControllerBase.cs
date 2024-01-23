namespace OJS.Servers.Administration.Controllers.Api;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OJS.Common;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = GlobalConstants.Roles.AdministratorOrLecturer)]
public abstract class ApiControllerBase : ControllerBase
{
}