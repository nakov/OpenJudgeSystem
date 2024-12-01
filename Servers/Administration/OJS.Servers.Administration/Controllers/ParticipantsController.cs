namespace OJS.Servers.Administration.Controllers;

using Microsoft.AspNetCore.Mvc;
using OJS.Common.Extensions;
using OJS.Data.Models.Participants;
using OJS.Servers.Administration.Attributes;
using OJS.Servers.Infrastructure.Extensions;
using OJS.Services.Administration.Business.Contests.Permissions;
using OJS.Services.Administration.Business.Participants;
using OJS.Services.Administration.Business.Participants.GridData;
using OJS.Services.Administration.Business.Participants.Permissions;
using OJS.Services.Administration.Business.Participants.Validators;
using OJS.Services.Administration.Models.Contests.Participants;
using OJS.Services.Administration.Models.Participants;
using OJS.Services.Common.Models.Pagination;
using System.Threading.Tasks;
using OJS.Data.Models;
using OJS.Services.Common.Data;

public class ParticipantsController : BaseAdminApiController<Participant, int, ParticipantInListViewModel, ParticipantAdministrationModel>
{
    private readonly IParticipantsGridDataService participantsGridDataService;
    private readonly IParticipantsBusinessService participantsBusinessService;
    private readonly ChangeParticipationTimeValidator changeParticipationTimeValidator;

    public ParticipantsController(
        IParticipantsGridDataService participantsGridDataService,
        IParticipantsBusinessService participantsBusinessService,
        ChangeParticipationTimeValidator changeParticipationTimeValidator,
        ParticipantAdministrationModelValidator validator,
        IDataService<AccessLog> accessLogsData)
        : base(
            participantsGridDataService,
            participantsBusinessService,
            validator,
            accessLogsData)
    {
        this.participantsGridDataService = participantsGridDataService;
        this.participantsBusinessService = participantsBusinessService;
        this.changeParticipationTimeValidator = changeParticipationTimeValidator;
    }

    [HttpGet("{contestId:int}")]
    [ProtectedEntityAction("contestId", typeof(ContestIdPermissionsService))]
    public async Task<IActionResult> GetByContestId([FromQuery] PaginationRequestModel model, [FromRoute] int contestId)
    {
        if (contestId < 1)
        {
            return this.BadRequest("Invalid contest id.");
        }

        return this.Ok(
            await this.participantsGridDataService
                .GetAll<ParticipantInListViewModel>(model, participant => participant.ContestId == contestId));
    }

    [HttpPost]
    [ProtectedEntityAction(nameof(model), typeof(ChangeParticipationTimeForMultipleParticipantsPermissionsService))]
    public async Task<IActionResult> ChangeParticipationTimeForMultipleParticipants(
        ChangeParticipationTimeForMultipleParticipantsModel model)
    {
        var validationResult = await this.changeParticipationTimeValidator
            .ValidateAsync(model)
            .ToExceptionResponseAsync();

        if (!validationResult.IsValid)
        {
            return this.UnprocessableEntity(validationResult.Errors);
        }

        return await this.participantsBusinessService
            .UpdateParticipationTimeForMultipleParticipants(model)
            .ToOkResult();
    }

    [HttpPost]
    [ProtectedEntityAction(nameof(model), typeof(ChangeParticipationTimeForSingleParticipantPermissionsService))]
    public async Task<IActionResult> ChangeParticipationTimeForSingleParticipant(
        ChangeParticipationTimeForSingleParticipantModel model)
    {
        var validationResult = await this.changeParticipationTimeValidator
            .ValidateAsync(model)
            .ToExceptionResponseAsync();

        if (!validationResult.IsValid)
        {
            return this.UnprocessableEntity(validationResult.Errors);
        }

        return await this.participantsBusinessService
            .UpdateParticipationTimeForSingleParticipant(model)
            .ToOkResult();
    }
}