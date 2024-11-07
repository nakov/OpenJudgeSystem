namespace OJS.Services.Ui.Business;

using OJS.Services.Ui.Models.Statistics;
using OJS.Services.Infrastructure;
using System.Threading.Tasks;

public interface IStatisticsPreviewBusinessService
    : IService
{
    Task<HomeStatisticsServiceModel> GetForHome();
}