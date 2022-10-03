namespace OJS.Servers.Ui.Controllers.Api;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OJS.Common.Extensions;
using OJS.Servers.Infrastructure.Extensions;
using OJS.Servers.Ui.Models.Participations;
using OJS.Services.Ui.Business;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static Microsoft.AspNetCore.Http.StatusCodes;

public class ParticipationsController : BaseApiController
{
    private readonly IParticipationsBusinessService participationsBusiness;

    public ParticipationsController(IParticipationsBusinessService participationsBusiness)
        => this.participationsBusiness = participationsBusiness;

    /// <summary>
    /// Gets all the participations of the current user for all the contests.
    /// </summary>
    /// <returns>A collection of contest participations</returns>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<ParticipationsResponseModel>), Status200OK)]
    public async Task<IActionResult> GetForProfile()
        => await this.participationsBusiness
            .GetParticipationsByUserId(this.User.GetId())
            .MapCollection<ParticipationsResponseModel>()
            .ToOkResult();

    private string? GetUserId(HttpContext context)
        => context.User.Claims.FirstOrDefault(x => x.Type.Contains("nameidentifier"))
            ?.Value;
}
