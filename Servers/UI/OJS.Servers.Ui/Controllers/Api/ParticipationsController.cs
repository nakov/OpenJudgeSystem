namespace OJS.Servers.Ui.Controllers.Api;

using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OJS.Common.Extensions;
using OJS.Servers.Infrastructure.Extensions;
using OJS.Servers.Ui.Models.Participations;
using OJS.Services.Ui.Business;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using OJS.Servers.Infrastructure.Controllers;
using static Microsoft.AspNetCore.Http.StatusCodes;

[Authorize]
public class ParticipationsController : BaseApiController
{
    private readonly IParticipationsBusinessService participationsBusiness;

    public ParticipationsController(IParticipationsBusinessService participationsBusiness)
        => this.participationsBusiness = participationsBusiness;

    /// <summary>
    /// Gets all user contest participations.
    /// </summary>
    /// <returns>A collection of contest participations.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<ParticipationsResponseModel>), Status200OK)]
    public async Task<IActionResult> GetAllForUser()
        => await this.participationsBusiness
            .GetParticipationsByUserId(this.User.GetId())
            .MapCollection<ParticipationsResponseModel>()
            .ToOkResult();
}
