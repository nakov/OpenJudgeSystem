namespace OJS.Servers.Ui.Controllers.Api;

using OJS.Servers.Ui.Models.Submissions.Details;
using OJS.Servers.Ui.Models.Submissions.Results;
using OJS.Services.Ui.Models.Submissions;
using OJS.Web.Models.Submissions;
using Microsoft.AspNetCore.Mvc;
using OJS.Servers.Infrastructure.Extensions;
using OJS.Services.Ui.Business;
using System.Collections.Generic;
using System.Threading.Tasks;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using OJS.Servers.Ui.Models.Submissions.Profile;
using static Microsoft.AspNetCore.Http.StatusCodes;

public class SubmissionsController : BaseApiController
{
    private readonly ISubmissionsBusinessService submissionsBusiness;

    public SubmissionsController(ISubmissionsBusinessService submissionsBusiness)
        => this.submissionsBusiness = submissionsBusiness;


    /// <summary>
    /// Gets submission details by provided submission id
    /// </summary>
    /// <param name="id">The id of the submission</param>
    /// <returns>Submission details model</returns>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(SubmissionDetailsResponseModel), Status200OK)]
    public async Task<IActionResult> Details(int id)
        => await this.submissionsBusiness
            .GetDetailsById(id)
            .Map<SubmissionDetailsResponseModel>()
            .ToOkResult();

    /// <summary>
    /// Gets all user submissions. Prepared for the user's profile page
    /// </summary>
    /// <returns>Collection of user submissions</returns>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<SubmissionForProfileResponseModel>), Status200OK)]
    public async Task<IActionResult> GetForProfile()
        => await this.submissionsBusiness
            .GetForProfileByUser(this.User.Identity?.Name)
            .MapCollection<SubmissionForProfileResponseModel>()
            .ToOkResult();

    /// <summary>
    /// Gets a subset of submissions by specific problem and given take count.
    /// </summary>
    /// <param name="id">The id of the problem</param>
    /// <param name="isOfficial">Should the submissions be only from compete mode</param>
    /// <param name="take">Number of submissions to return</param>
    /// <returns>A collection of submissions for a specific problem</returns>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(IEnumerable<SubmissionResultsResponseModel>), Status200OK)]
    public async Task<IActionResult> GetSubmissionResultsByProblem(
        int id,
        [FromQuery]bool isOfficial,
        [FromQuery]int take)
        => await this.submissionsBusiness
            .GetSubmissionResultsByProblem(id, isOfficial, take)
            .MapCollection<SubmissionResultsResponseModel>()
            .ToOkResult();

    /// <summary>
    /// Saves/updates the provided execution result for the given submission in the database.
    /// </summary>
    /// <param name="submissionExecutionResult">The submission execution result</param>
    /// <returns>Success model</returns>
    /// <remarks>
    /// The submission comes from the Judge distributor system.
    /// It sends it to here after executing it on a remote worker.
    /// </remarks>
    // TODO: align distributor endpoint and remove the custom path
    [HttpPost("/Submissions/SaveExecutionResult")]
    [ProducesResponseType(typeof(SaveExecutionResultResponseModel), Status200OK)]
    public async Task<IActionResult> SaveExecutionResult([FromBody] SubmissionExecutionResult submissionExecutionResult)
    {
        await this.submissionsBusiness.ProcessExecutionResult(submissionExecutionResult);

        var result = new SaveExecutionResultResponseModel
        {
            SubmissionId = submissionExecutionResult.SubmissionId,
        };

        return this.Ok(result);
    }
}
