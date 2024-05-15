namespace OJS.Servers.Ui.Controllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OJS.Servers.Infrastructure.Controllers;
using OJS.Services.Ui.Business;
using System;
using System.Threading.Tasks;
using static Microsoft.AspNetCore.Http.StatusCodes;
using static OJS.Common.GlobalConstants.HeaderKeys;
using static OJS.Common.GlobalConstants.HeaderValues;
using static OJS.Common.GlobalConstants.MimeTypes;

public class ProblemResourcesController : BaseApiController
{
    private readonly IProblemResourcesBusinessService problemResourcesBusinessService;

    public ProblemResourcesController(IProblemResourcesBusinessService problemResourcesBusinessService)
        => this.problemResourcesBusinessService = problemResourcesBusinessService;

    /// <summary>
    /// Gets problem resource file, by provided resource id.
    /// </summary>
    /// <param name="id">The problem resource id.</param>
    /// <returns>A file with the problem resource.</returns>
    [HttpGet("{id:int}")]
    [Authorize]
    [Produces(ApplicationOctetStream)]
    [ProducesResponseType(typeof(FileContentResult), Status200OK)]
    public async Task<IActionResult> GetResource(int id)
    {
        var resource = await this.problemResourcesBusinessService.GetResource(id);

        this.Response.Headers.Add(ContentDisposition, $"{ContentDispositionFileNameUtf8}{Uri.EscapeDataString(resource.Name)}.{resource.FileExtension}");
        return this.File(resource.File!, ApplicationOctetStream);
    }
}