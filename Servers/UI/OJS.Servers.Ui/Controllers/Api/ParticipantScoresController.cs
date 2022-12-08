namespace OJS.Servers.Ui.Controllers.Api;

using OJS.Services.Ui.Business;
using System.Threading.Tasks;
using OJS.Servers.Infrastructure.Extensions;
using OJS.Services.Ui.Models.Participations;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using static Microsoft.AspNetCore.Http.StatusCodes;

public class ParticipantScoresController : BaseApiController
{
    public IParticipantScoresBusinessService participantScoresBusinessService;


    public ParticipantScoresController(IParticipantScoresBusinessService participantScoresBusinessService)
        => this.participantScoresBusinessService = participantScoresBusinessService;

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(IEnumerable<ParticipationForProblemMaxScoreServiceModel>), Status200OK)]
    public async Task<IActionResult> GetScoresForParticipant(int id)
        => await this.participantScoresBusinessService
            .GetAllForParticipant(id)
            .ToOkResult();
}