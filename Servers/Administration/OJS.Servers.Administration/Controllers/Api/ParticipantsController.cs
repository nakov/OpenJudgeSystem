namespace OJS.Servers.Administration.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using OJS.Services.Common.Models.Pagination;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Models.Contests.Participants;

public class ParticipantsController : ApiControllerBase
{
    private readonly IParticipantsBusinessService participantsBusinessService;

    public ParticipantsController(IParticipantsBusinessService participantsBusinessService)
        => this.participantsBusinessService = participantsBusinessService;

    [HttpGet]
    [Route("contest/{contestId}")]
    public async Task<IActionResult> GetByContestId([FromQuery] PaginationRequestModel model, [FromRoute] int contestId)
    {
        // TODO maybe check for higher number that contests count;
        if (contestId < 1)
        {
            return this.BadRequest("Invalid contest id.");
        }

        return this.Ok(
            await this.participantsBusinessService
                .GetAll<ContestViewParticipantsModel>(model, this.participantsBusinessService
                    .GetByContest(contestId)));
    }
}