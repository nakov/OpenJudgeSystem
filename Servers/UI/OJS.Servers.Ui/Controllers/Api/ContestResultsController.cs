namespace OJS.Servers.Ui.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using OJS.Common.Extensions;
using OJS.Services.Common;
using OJS.Services.Common.Models.Contests.Results;
using OJS.Services.Infrastructure.Extensions;
using OJS.Services.Ui.Business.Validation;
using OJS.Services.Ui.Data;
using System.Threading.Tasks;
using static OJS.Common.GlobalConstants.MimeTypes;
using static Microsoft.AspNetCore.Http.StatusCodes;

[Produces(ApplicationJson)]
public class ContestResultsController : BaseApiController
{
    private readonly IContestResultsAggregatorService contestResultsAggregator;
    private readonly IContestsDataService contestsData;
    private readonly IContestResultsValidationService contestResultsValidation;

    public ContestResultsController(
        IContestResultsAggregatorService contestResultsAggregator,
        IContestsDataService contestsData,
        IContestResultsValidationService contestResultsValidation)
    {
        this.contestResultsAggregator = contestResultsAggregator;
        this.contestsData = contestsData;
        this.contestResultsValidation = contestResultsValidation;
    }

    /// <summary>
    /// Gets the results of all the participants in a given contest.
    /// </summary>
    /// <param name="id">The id of the contest</param>
    /// <param name="official">Indicates if the results are for compete or practice mode of the contest</param>
    /// <param name="full">Full results with test run details or just the scores</param>
    /// <returns>A complete collection of all the participants and their results</returns>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ContestResultsViewModel), Status200OK)]
    public async Task<ContestResultsViewModel> GetResults(int id, bool official, bool full)
    {
        var contest = await this.contestsData.GetByIdWithProblems(id);

        this.contestResultsValidation
            .GetValidationResult((contest, full))
            .VerifyResult();

        var results = this.contestResultsAggregator.GetContestResults(
            contest!,
            official,
            this.User.IsAdminOrLecturer(),
            full);

        return results;
    }
}