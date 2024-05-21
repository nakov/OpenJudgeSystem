namespace OJS.Servers.Ui.Controllers;

using Microsoft.AspNetCore.Mvc;
using OJS.Servers.Infrastructure.Controllers;
using OJS.Servers.Infrastructure.Extensions;
using OJS.Services.Infrastructure.Cache;
using OJS.Services.Ui.Business;
using OJS.Services.Ui.Models.Statistics;
using System.Threading.Tasks;

public class StatisticsPreviewController : BaseApiController
{
    private const string HomeStatisticsCacheKey = "HOME-STATISTICS";

    private readonly IStatisticsPreviewBusinessService statisticsPreviewPreviewBusiness;
    private readonly ICacheService cache;

    public StatisticsPreviewController(
        IStatisticsPreviewBusinessService statisticsPreviewPreviewBusiness,
        ICacheService cache)
    {
        this.statisticsPreviewPreviewBusiness = statisticsPreviewPreviewBusiness;
        this.cache = cache;
    }

    [HttpGet]
    public async Task<IActionResult> GetForHome()
        // => await this.cache.Get(
        //         HomeStatisticsCacheKey,
        //         this.statisticsPreviewPreviewBusiness.GetForHome)
        //     .ToOkResult();
        => await Task.FromResult(new HomeStatisticsServiceModel
        {
            ContestsCount = 4200,
            ProblemsCount = 29280,
            StrategiesCount = 70,
            SubmissionsCount = 35184876,
            SubmissionsPerDayCount = 11704,
            UsersCount = 172000,
        }).ToOkResult();
}