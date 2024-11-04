namespace OJS.Servers.Administration.Controllers;

using Infrastructure.Controllers;
using Infrastructure.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Services.Administration.Business.Contests;
using Services.Administration.Models.Contests;
using System.Threading.Tasks;
using static Microsoft.AspNetCore.Http.StatusCodes;
using static OJS.Servers.Infrastructure.ServerConstants.Authorization;

/// <summary>
/// Separate controller for api endpoints used for external purposes by SULS or the legacy system.
/// Defined separately so ApiKeyPolicy can be enforced for authorization,
/// bypassing the default authorization used for the rest of the admin controllers.
/// </summary>
[Authorize(ApiKeyPolicyName)]
[Route("api/contests")]
public class ContestsExternalController : BaseApiController
{
    private readonly IContestsBusinessService contestsBusinessService;

    public ContestsExternalController(IContestsBusinessService contestsBusinessService)
        => this.contestsBusinessService = contestsBusinessService;


    /// <summary>
    /// Gets details of a contest by id.
    /// </summary>
    /// <param name="id">ID of the contest.</param>
    /// <returns>Model containing all information about the name, description and problems of the contest.</returns>
    [ProducesResponseType(typeof(ContestLegacyExportServiceModel), Status200OK)]
    [HttpPost("Export/{id:int}")]
    public async Task<IActionResult> Export(int id)
        => await this.contestsBusinessService
            .Export(id)
            .ToOkResult();

    /// <summary>
    /// Returns only existing ids from a list of provided ids.
    /// </summary>
    /// <param name="requestModel"></param>
    /// <returns></returns>
    [HttpPost("GetExistingIds")]
    public async Task<IActionResult> GetExistingIds(ContestsGetExistingIdsRequestModel requestModel)
    {
        var existingContestIds = await this.contestsBusinessService.GetExistingIds(requestModel.Ids);

        return this.Content(JsonConvert.SerializeObject(existingContestIds));
    }
}