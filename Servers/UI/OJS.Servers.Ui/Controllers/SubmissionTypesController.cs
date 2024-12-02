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

public class SubmissionTypesController(ISubmissionTypesCacheService submissionTypesCache) : BaseApiController
{
    /// <summary>
    /// Gets all submission types for a contest category.
    /// </summary>
    /// <param name="contestCategoryId">The id of the contest category.</param>
    /// <returns>A collection of all submission types for the given contest category.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<SubmissionTypeFilterResponseModel>), Status200OK)]
    public async Task<IActionResult> GetAllForContestCategory(int contestCategoryId)
        => await submissionTypesCache
            .GetAllForContestCategory(contestCategoryId)
            .MapCollection<SubmissionTypeFilterResponseModel>()
            .ToOkResult();
}