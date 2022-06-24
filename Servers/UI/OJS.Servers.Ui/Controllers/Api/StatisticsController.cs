namespace OJS.Servers.Ui.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

public class StatisticsController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetForIndex()
        => this.Ok(await Task.FromResult(new
        {
            usersCount = 15_000,
            submissionsCount = 2_000_000,
            submissionsPerMinute = 160,
            contestsCount = 2000,
            problemsCount = 10_000,
            strategiesCount = 37,
        }));
}