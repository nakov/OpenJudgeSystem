namespace OJS.Servers.Administration.Controllers.Api;

using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using OJS.Data.Models.Participants;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Business.Participants;
using OJS.Services.Administration.Business.Participants.Validators;
using OJS.Services.Administration.Models.Contests.Participants;
using OJS.Services.Administration.Models.Participants;
using OJS.Services.Common.Models.Pagination;
using System.Threading.Tasks;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.Validation;

public class ParticipantsController : BaseAdminApiController<Participant, int, ContestViewParticipantsModel, ParticipantsAdministrationModel>
{
    private readonly IGridDataService<Participant> participantsGridDataService;

    public ParticipantsController(
        IGridDataService<Participant> participantsGridDataService,
        IParticipantsBusinessService participantsBusinessService,
        ParticipantsAdministrationModelValidator validator,
        IValidator<BaseDeleteValidationModel<int>> deleteValidator,
        IPermissionsService<ParticipantsAdministrationModel, int> permissionsService)
        : base(
            participantsGridDataService,
            participantsBusinessService,
            validator,
            deleteValidator,
            permissionsService)
        => this.participantsGridDataService = participantsGridDataService;

    [HttpGet("{contestId:int}")]
    public async Task<IActionResult> GetByContestId([FromQuery] PaginationRequestModel model, [FromRoute] int contestId)
    {
        if (contestId < 1)
        {
            return this.BadRequest("Invalid contest id.");
        }

        return this.Ok(
            await this.participantsGridDataService
                .GetAll<ContestViewParticipantsModel>(model, participant => participant.ContestId == contestId));
    }
}