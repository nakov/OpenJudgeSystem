namespace OJS.Servers.Ui.Controllers.Api;

using SoftUni.AutoMapper.Infrastructure.Extensions;
using OJS.Servers.Infrastructure.Extensions;
using OJS.Services.Ui.Models.Search;
using System.Threading.Tasks;
using OJS.Services.Ui.Business;
using Microsoft.AspNetCore.Mvc;
using static Microsoft.AspNetCore.Http.StatusCodes;

public class SearchController : BaseApiController
{
    private readonly ISearchBusinessService searchBusinessService;

    public SearchController(ISearchBusinessService searchBusinessService)
        => this.searchBusinessService = searchBusinessService;

    /// <summary>
    /// Searches for all contests, problems and users that match the search.
    /// </summary>
    /// <param name="searchTerm">The required search from the user.</param>
    /// <returns>A collection of all contests, problems and users based on the search.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(SearchResponseModel), Status200OK)]
    public async Task<IActionResult> GetSearchResults([FromQuery]string? searchTerm)
        => await this.searchBusinessService
            .GetSearchResults(searchTerm)
            .Map<SearchResponseModel>()
            .ToOkResult();
}