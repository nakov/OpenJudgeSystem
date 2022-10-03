namespace OJS.Servers.Ui.Controllers.Api;

using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OJS.Services.Ui.Business;
using static OJS.Common.GlobalConstants.HeaderValues;
using static OJS.Common.GlobalConstants.HeaderKeys;
using static OJS.Common.GlobalConstants.MimeTypes;
using static Microsoft.AspNetCore.Http.StatusCodes;

public class ProblemResourcesController : BaseApiController
{
    private readonly IProblemResourcesBusinessService problemResourcesBusinessService;

    public ProblemResourcesController(IProblemResourcesBusinessService problemResourcesBusinessService)
        => this.problemResourcesBusinessService = problemResourcesBusinessService;

    /// <summary>
    /// Gets problem resource file, by provided resource id
    /// </summary>
    /// <param name="id">The problem resource id</param>
    /// <returns>A file with the problem resource</returns>
    [HttpGet]
    [Authorize]
    [Produces(ApplicationOctetStream)]
    [ProducesResponseType(typeof(FileContentResult), Status200OK)]
    public async Task<IActionResult> GetResource(int id)
    {
        var resource = await this.problemResourcesBusinessService.GetResource(id);

        Response.Headers.Add(ContentDisposition, $"{ContentDispositionFileNameUtf8}{Uri.EscapeDataString(resource.Name)}.{resource.FileExtension}");
        return this.File(resource.File, ApplicationOctetStream);
    }
}