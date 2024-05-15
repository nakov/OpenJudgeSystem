namespace OJS.Servers.Ui.Controllers;

using Microsoft.AspNetCore.Mvc;
using OJS.Servers.Infrastructure.Controllers;
using OJS.Servers.Infrastructure.Extensions;
using OJS.Servers.Ui.Models;
using OJS.Servers.Ui.Models.Search;
using OJS.Services.Infrastructure.Extensions;
using OJS.Services.Ui.Business;
using OJS.Services.Ui.Models.Search;
using System.Threading.Tasks;
using static Microsoft.AspNetCore.Http.StatusCodes;

public class SearchController : BaseApiController
{
    private readonly ISearchBusinessService searchBusinessService;

    public SearchController(ISearchBusinessService searchBusinessService)
        => this.searchBusinessService = searchBusinessService;

    /// <summary>
    /// Searches for all contests that match the search.
    /// </summary>
    /// <param name="model">The required search criteria from the user and pagination options.</param>
    /// <returns>A collections of contests based on the search results.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(ContestSearchResponseModel), Status200OK)]
    public async Task<IActionResult> GetContestsSearchResults([FromQuery] SearchRequestModel model)
        => await this.searchBusinessService
            .GetContestSearchResults(model.Map<SearchServiceModel>())
            .Map<PagedResultResponse<ContestSearchResponseModel>>()
            .ToOkResult();

    /// <summary>
    /// Searches for all problems that match the search.
    /// </summary>
    /// <param name="model">The required search criteria from the user and pagination options.</param>
    /// <returns>A collections of problems based on the search results.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(ProblemSearchResponseModel), Status200OK)]
    public async Task<IActionResult> GetProblemsSearchResults([FromQuery] SearchRequestModel model)
        => await this.searchBusinessService
            .GetProblemSearchResults(model.Map<SearchServiceModel>())
            .Map<PagedResultResponse<ProblemSearchResponseModel>>()
            .ToOkResult();

    /// <summary>
    /// Searches for all users that match the search.
    /// </summary>
    /// <param name="model">The required search criteria from the user and pagination options.</param>
    /// <returns>A collections of users based on the search results.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(UserSearchResponseModel), Status200OK)]
    public async Task<IActionResult> GetUsersSearchResults([FromQuery] SearchRequestModel model)
        => await this.searchBusinessService
            .GetUserSearchResults(model.Map<SearchServiceModel>())
            .Map<PagedResultResponse<UserSearchResponseModel>>()
            .ToOkResult();
}