namespace OJS.Servers.Ui.Controllers.Api;

using SoftUni.AutoMapper.Infrastructure.Extensions;
using Models.Search;
using Models;
using OJS.Services.Ui.Business;
using OJS.Servers.Infrastructure.Extensions;
using OJS.Services.Ui.Models.Search;
using System.Threading.Tasks;
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
    /// <param name="model">The required search from the user and page options..</param>
    /// <returns>A page with contests, problems and users based on the search.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(SearchResponseModel), Status200OK)]
    public async Task<IActionResult> GetSearchResults([FromQuery] SearchRequestModel model)
        => await this.searchBusinessService
            .GetSearchResults(model.Map<SearchServiceModel>())
            .Map<PagedResultResponse<SearchResponseModel>>()
            .ToOkResult();
}