namespace OJS.Servers.Ui.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using OJS.Servers.Ui.Models;
using OJS.Servers.Ui.Models.Contests;
using OJS.Services.Ui.Business;
using OJS.Services.Ui.Models.Contests;
using System.Threading.Tasks;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using static Microsoft.AspNetCore.Http.StatusCodes;

public class ContestsController : BaseApiController
{
    private readonly IContestsBusinessService contestsBusinessService;

    public ContestsController(IContestsBusinessService contestsBusinessService)
        => this.contestsBusinessService = contestsBusinessService;

    /// <summary>
    /// Gets contests summary with latest active and past contests for the home page.
    /// </summary>
    /// <returns>A collection of active and past contests</returns>
    [HttpGet]
    [ProducesResponseType(typeof(ContestsForHomeIndexResponseModel), Status200OK)]
    public async Task<ContestsForHomeIndexResponseModel> GetForHomeIndex()
        => await this.contestsBusinessService
            .GetAllForHomeIndex()
            .Map<ContestsForHomeIndexResponseModel>();

    /// <summary>
    /// Gets a page with visible contests, by applied filters.
    /// If no page options are provided, default values are applied.
    /// </summary>
    /// <param name="model">The filters by which the contests should be filtered and page options</param>
    /// <returns>A page with contests, filtered by provided filters.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(PagedResultResponse<ContestForListingResponseModel>), Status200OK)]
    public async Task<PagedResultResponse<ContestForListingResponseModel>> GetAll([FromQuery] ContestFiltersRequestModel? model)
        => await this.contestsBusinessService
            .GetAllByFilters(model?.Map<ContestFiltersServiceModel>())
            .Map<PagedResultResponse<ContestForListingResponseModel>>();
}
