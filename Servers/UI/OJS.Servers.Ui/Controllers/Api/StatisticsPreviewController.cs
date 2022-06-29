namespace OJS.Servers.Ui.Controllers.Api;

using Microsoft.AspNetCore.Mvc;
using OJS.Services.Ui.Business;
using System.Threading.Tasks;

public class StatisticsPreviewController : ControllerBase
{
    private readonly IStatisticsPreviewBusinessService statisticsPreviewPreviewBusiness;

    public StatisticsPreviewController(IStatisticsPreviewBusinessService statisticsPreviewPreviewBusiness)
        => this.statisticsPreviewPreviewBusiness = statisticsPreviewPreviewBusiness;

    [HttpGet]
    public async Task<IActionResult> GetForHome()
        => this.Ok(
            await this.statisticsPreviewPreviewBusiness.GetForHome());
}