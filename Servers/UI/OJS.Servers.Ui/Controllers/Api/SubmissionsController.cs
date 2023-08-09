namespace OJS.Servers.Ui.Controllers.Api;

using OJS.Servers.Ui.Models;
using OJS.Services.Ui.Business.Cache;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using OJS.Services.Ui.Models.Submissions;
using OJS.Services.Ui.Business;
using OJS.Services.Common.Models.Submissions;
using OJS.Servers.Infrastructure.Extensions;
using OJS.Servers.Ui.Models.Submissions.Profile;
using OJS.Servers.Ui.Models.Submissions.Details;
using OJS.Servers.Ui.Models.Submissions.Results;
using OJS.Servers.Infrastructure.Controllers;
using static Microsoft.AspNetCore.Http.StatusCodes;

public class SubmissionsController : BaseApiController
{
    private readonly ISubmissionsBusinessService submissionsBusiness;
    private readonly ISubmissionsForProcessingBusinessService submissionsForProcessingBusiness;
    private readonly ISubmissionCacheService submissionCache;

    public SubmissionsController(
        ISubmissionsBusinessService submissionsBusiness,
        ISubmissionsForProcessingBusinessService submissionsForProcessingBusiness,
        ISubmissionCacheService submissionCache)
    {
        this.submissionsBusiness = submissionsBusiness;
        this.submissionsForProcessingBusiness = submissionsForProcessingBusiness;
        this.submissionCache = submissionCache;
    }

    /// <summary>
    /// Gets submission details by provided submission id.
    /// </summary>
    /// <param name="id">The id of the submission.</param>
    /// <returns>Submission details model.</returns>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(SubmissionDetailsResponseModel), Status200OK)]
    public async Task<IActionResult> Details(int id)
        => await this.submissionsBusiness
            .GetDetailsById(id)
            .Map<SubmissionDetailsResponseModel>()
            .ToOkResult();

    /// <summary>
    /// Gets all user submissions. Prepared for the user's profile page.
    /// </summary>
    /// <returns>Collection of user submissions.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<SubmissionForProfileResponseModel>), Status200OK)]
    public async Task<IActionResult> GetForProfile()
        => await this.submissionsBusiness
            .GetForProfileByUser(this.User.Identity?.Name)
            .MapCollection<SubmissionForProfileResponseModel>()
            .ToOkResult();

    /// <summary>
    /// Gets the submitted file.
    /// </summary>
    /// <param name="id">Id of the submission.</param>
    /// <returns>The file to download.</returns>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(FileContentResult), Status200OK)]
    public IActionResult Download(int id)
    {
        var submissionDownloadServiceModel = this.submissionsBusiness.GetSubmissionFile(id);

        return this.File(submissionDownloadServiceModel.Content!, submissionDownloadServiceModel.MimeType!, submissionDownloadServiceModel.FileName);
    }

    /// <summary>
    /// Gets a subset of submissions by specific problem and given take count.
    /// </summary>
    /// <param name="id">The id of the problem.</param>
    /// <param name="isOfficial">Should the submissions be only from compete mode.</param>
    /// <param name="take">Number of submissions to return.</param>
    /// <returns>A collection of submissions for a specific problem.</returns>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(IEnumerable<SubmissionResultsResponseModel>), Status200OK)]
    public async Task<IActionResult> GetSubmissionResultsByProblem(
        int id,
        [FromQuery] bool isOfficial,
        [FromQuery] int take)
        => await this.submissionsBusiness
            .GetSubmissionResultsByProblem(id, isOfficial, take)
            .MapCollection<SubmissionResultsResponseModel>()
            .ToOkResult();

    /// <summary>
    /// Gets a subset of submission results for the selected user by specific problem and given take count.
    /// </summary>
    /// <param name="submissionId">The id of the submission.</param>
    /// <param name="isOfficial">Should the submissions be only from compete mode.</param>
    /// <param name="take">Number of submissions to return.</param>
    /// <returns>A collection of submissions for a specific problem.</returns>
    [HttpGet("{submissionId:int}")]
    [ProducesResponseType(typeof(IEnumerable<SubmissionResultsResponseModel>), Status200OK)]
    public async Task<IActionResult> GetSubmissionDetailsResults(
        int submissionId,
        [FromQuery] bool isOfficial,
        [FromQuery] int take)
        => await this.submissionsBusiness
            .GetSubmissionDetailsResults(submissionId, isOfficial, take)
            .MapCollection<SubmissionResultsResponseModel>()
            .ToOkResult();

    /// <summary>
    /// Saves/updates the provided execution result for the given submission in the database.
    /// </summary>
    /// <param name="submissionExecutionResult">The submission execution result.</param>
    /// <returns>Success model.</returns>
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

        var result = new SaveExecutionResultResponseModel { SubmissionId = submissionExecutionResult.SubmissionId, };

        return this.Ok(result);
    }

    /// <summary>
    /// Gets latest submissions (default number of submissions).
    /// </summary>
    /// <param name="page">The current page number.</param>
    /// <returns>A page with submissions containing information about their score and user.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(PagedResultResponse<SubmissionForPublicSubmissionsResponseModel>), Status200OK)]
    public async Task<IActionResult> Public([FromQuery]int page)
        => await this.submissionsBusiness
            .GetPublicSubmissions(new SubmissionForPublicSubmissionsServiceModel
            {
                PageNumber = page,
            })
            .Map<PagedResultResponse<SubmissionForPublicSubmissionsResponseModel>>()
            .ToOkResult();

    /// <summary>
    /// Gets all unprocessed submissions.
    /// </summary>
    /// <param name="page">The current page number.</param>
    /// <returns>A page with unprocessed submissions.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(PagedResultResponse<SubmissionForPublicSubmissionsResponseModel>), Status200OK)]
    public async Task<IActionResult> GetProcessingSubmissions([FromQuery]int page)
        => await this.submissionsBusiness
            .GetProcessingSubmissions(page)
            .Map<PagedResultResponse<SubmissionForPublicSubmissionsResponseModel>>()
            .ToOkResult();

    /// <summary>
    /// Gets the count of all submissions.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(int), Status200OK)]
    public async Task<IActionResult> TotalCount()
        => await this.submissionCache
            .GetTotalCount()
            .ToOkResult();

    /// <summary>
    /// Gets the count of all unprocessed submissions.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(int), Status200OK)]
    public async Task<IActionResult> UnprocessedTotalCount()
        => await this.submissionsForProcessingBusiness
            .GetUnprocessedTotalCount()
            .ToOkResult();
}