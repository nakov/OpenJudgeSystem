namespace OJS.Servers.Ui.Controllers;

using Microsoft.AspNetCore.Mvc;
using OJS.Servers.Infrastructure.Controllers;
using OJS.Servers.Infrastructure.Extensions;
using OJS.Servers.Ui.Models.SubmissionTypes;
using OJS.Services.Infrastructure.Extensions;
using OJS.Services.Ui.Business.Cache;
using System.Collections.Generic;
using System.Threading.Tasks;
using static Microsoft.AspNetCore.Http.StatusCodes;

public class SubmissionTypesController : BaseApiController
{
    private readonly ISubmissionTypesCacheService submissionTypesCache;

    public SubmissionTypesController(
        ISubmissionTypesCacheService submissionTypesCache)
        => this.submissionTypesCache = submissionTypesCache;

    /// <summary>
    /// Gets all submission types ordered by most used to least.
    /// </summary>
    /// <returns>A collection of all submission types.</returns>
    /// <remarks>
    /// Usage is determined by gathering information from latest submissions.
    /// </remarks>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<SubmissionTypeFilterResponseModel>), Status200OK)]
    public async Task<IActionResult> GetAllOrderedByLatestUsage()
        => await this.submissionTypesCache
            .GetAllOrderedByLatestUsage()
            .MapCollection<SubmissionTypeFilterResponseModel>()
            .ToOkResult();
}