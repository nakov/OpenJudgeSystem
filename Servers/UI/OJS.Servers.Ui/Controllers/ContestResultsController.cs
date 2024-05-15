namespace OJS.Servers.Ui.Controllers;

using Microsoft.AspNetCore.Mvc;
using OJS.Servers.Infrastructure.Controllers;
using OJS.Servers.Infrastructure.Extensions;
using OJS.Services.Common.Models.Contests.Results;
using OJS.Services.Ui.Business;
using System.Threading.Tasks;
using static Microsoft.AspNetCore.Http.StatusCodes;

public class ContestResultsController : BaseApiController
{
    private readonly IContestResultsBusinessService contestResultsBusiness;

    public ContestResultsController(IContestResultsBusinessService contestResultsBusiness)
        => this.contestResultsBusiness = contestResultsBusiness;

    /// <summary>
    /// Gets the results of all the participants in a given contest.
    /// </summary>
    /// <param name="id">The id of the contest.</param>
    /// <param name="official">Indicates if the results are for compete or practice mode of the contest.</param>
    /// <param name="full">Full results with test run details or just the scores.</param>
    /// <returns>A complete collection of all the participants and their results.</returns>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ContestResultsViewModel), Status200OK)]
    public async Task<IActionResult> GetResults(int id, bool official, bool full)
        => await this.contestResultsBusiness
            .GetContestResults(id, official, full)
            .ToOkResult();
}