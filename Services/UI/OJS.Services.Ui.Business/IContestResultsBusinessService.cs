namespace OJS.Services.Ui.Business;

using SoftUni.Services.Infrastructure;
using OJS.Services.Common.Models.Contests.Results;
using System.Threading.Tasks;

public interface IContestResultsBusinessService : IService
{
    Task<ContestResultsServiceModel> GetContestResults(
        int contestId,
        bool official,
        bool isFullResults,
        int? cacheSeconds);
}