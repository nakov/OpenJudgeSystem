namespace OJS.Servers.Ui.Controllers;

using Microsoft.AspNetCore.Mvc;
using OJS.Servers.Infrastructure.Controllers;
using OJS.Servers.Infrastructure.Extensions;
using OJS.Services.Ui.Business;
using OJS.Services.Ui.Models.Participations;
using System.Collections.Generic;
using System.Threading.Tasks;
using static Microsoft.AspNetCore.Http.StatusCodes;

public class ParticipantScoresController : BaseApiController
{
    private IParticipantScoresBusinessService participantScoresBusinessService;

    public ParticipantScoresController(IParticipantScoresBusinessService participantScoresBusinessService)
        => this.participantScoresBusinessService = participantScoresBusinessService;

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(IEnumerable<ParticipationForProblemMaxScoreServiceModel>), Status200OK)]
    public async Task<IActionResult> GetScoresForParticipant(int id)
        => await this.participantScoresBusinessService
            .GetAllForParticipant(id)
            .ToOkResult();
}