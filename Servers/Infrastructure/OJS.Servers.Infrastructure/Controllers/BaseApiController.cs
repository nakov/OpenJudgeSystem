namespace OJS.Servers.Infrastructure.Controllers;

using Microsoft.AspNetCore.Mvc;
using static OJS.Common.GlobalConstants.MimeTypes;

[ApiController]
[Route("api/[controller]/[action]")]
[Produces(ApplicationJson)]
public class BaseApiController : ControllerBase
{
}