namespace OJS.Servers.Administration.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using OJS.Data.Models.Participants;
using OJS.Services.Administration.Models.Contests.Participants;
using OJS.Services.Common.Models.Pagination;
using System.Threading.Tasks;
using OJS.Services.Common.Data.Pagination;

public class ParticipantsController : BaseAdminApiController<Participant, ContestViewParticipantsModel>
{
    public ParticipantsController(
        IGridDataService<Participant> participantsGridDataService)
        : base(participantsGridDataService)
    {
    }

    [HttpGet("{contestId:int}")]
    public async Task<IActionResult> GetByContestId([FromQuery] PaginationRequestModel model, [FromRoute] int contestId)
    {
        if (contestId < 1)
        {
            return this.BadRequest("Invalid contest id.");
        }

        return this.Ok(
            await this.GetWithFilter<ContestViewParticipantsModel>(model, participant => participant.ContestId == contestId));
    }
}