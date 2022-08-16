using OJS.Servers.Ui.Models.Contests;

namespace OJS.Servers.Ui.Controllers.Api;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OJS.Servers.Ui.Models.Problems;
using OJS.Servers.Ui.Models.Submissions.Compete;
using OJS.Services.Ui.Business;
using OJS.Services.Ui.Models.Contests;
using OJS.Services.Ui.Models.Submissions;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System.Collections.Generic;
using System.Threading.Tasks;
using OJS.Servers.Infrastructure.Extensions;
using static Microsoft.AspNetCore.Http.StatusCodes;

[Authorize]
public class CompeteController : BaseApiController
{
    private readonly IContestsBusinessService contestsBusiness;
    private readonly ISubmissionsBusinessService submissionsBusinessService;
    private readonly IParticipantScoresBusinessService participantScoresBusinessService;

    public CompeteController(
        IContestsBusinessService contestsBusiness,
        ISubmissionsBusinessService submissionsBusinessService,
        IParticipantScoresBusinessService participantScoresBusinessService)
    {
        this.contestsBusiness = contestsBusiness;
        this.submissionsBusinessService = submissionsBusinessService;
        this.participantScoresBusinessService = participantScoresBusinessService;
    }

    /// <summary>
    /// Starts a contest for the user. Creates participant and starts time counter.
    /// </summary>
    /// <param name="id">The id of the contest</param>
    /// <param name="official">Is the contest compete or practice</param>
    /// <returns>The new participant</returns>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ContestParticipationServiceModel), Status200OK)]
    public async Task<IActionResult> Index(int id, [FromQuery] bool official)
        => await this.contestsBusiness
            .StartContestParticipation(new StartContestParticipationServiceModel
            {
                ContestId = id,
                IsOfficial = official,
            })
            .ToOkResult();

    /// <summary>
    /// Submits user's code for evaluation.
    /// </summary>
    /// <param name="model">The submission model containing the code and execution context</param>
    /// <returns>Success status code</returns>
    [HttpPost]
    public async Task<IActionResult> Submit([FromBody] SubmissionRequestModel model)
        => await this.submissionsBusinessService
            .Submit(model.Map<SubmitSubmissionServiceModel>())
            .ToOkResult();

    /// <summary>
    /// Gets the best results for the given problem by all participants.
    /// </summary>
    /// <param name="id">The id of the problem</param>
    /// <returns>A model with the best scores for the problem from all participants</returns>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(IEnumerable<ProblemResultResponseModel>), Status200OK)]
    public async Task<IActionResult> GetResultsByProblem(int id)
        => await this.participantScoresBusinessService
            .GetParticipantScoresByProblemForUser(id, true)
            .MapCollection<ProblemResultResponseModel>()
            .ToOkResult();
}
