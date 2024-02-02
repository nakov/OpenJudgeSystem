namespace OJS.Servers.Administration.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using OJS.Data.Models.Participants;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Business.Participants;
using OJS.Services.Administration.Business.Participants.Validators;
using OJS.Services.Administration.Models.Contests.Participants;
using OJS.Services.Administration.Models.Participants;
using OJS.Services.Administration.Models.Validation;
using OJS.Services.Common.Data.Pagination;
using OJS.Services.Common.Models.Pagination;
using System.Threading.Tasks;

public class ParticipantsController : BaseAdminApiController<Participant, ContestViewParticipantsModel, ParticipantsAdministrationModel>
{
    public ParticipantsController(
        IGridDataService<Participant> participantsGridDataService,
        IParticipantsBusinessService participantsBusinessService,
        ParticipantsAdministrationModelValidator validator,
        ParticipantsDeleteValidator deleteValidator)
        : base(
            participantsGridDataService,
            participantsBusinessService,
            validator,
            deleteValidator)
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