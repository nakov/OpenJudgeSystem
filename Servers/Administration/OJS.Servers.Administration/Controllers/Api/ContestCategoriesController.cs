namespace OJS.Servers.Administration.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.ContestCategories;
using System.Threading.Tasks;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System.Linq;

[ApiController]
[Route("api/[controller]")]
public class ContestCategoriesController : ControllerBase
{
    private readonly IContestCategoriesDataService contestCategoriesDataService;

    public ContestCategoriesController(IContestCategoriesDataService contestCategoriesDataService)
        => this.contestCategoriesDataService = contestCategoriesDataService;

    [HttpGet]
    [Route("dropdown")]
    public IActionResult GetForContestDropdown()
        => this.Ok(
             this.contestCategoriesDataService
            .GetAllVisible()
            .ToHashSet()
            .MapCollection<ContestCategoriesInContestView>());
}