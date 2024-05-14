namespace OJS.Services.Ui.Business;

using OJS.Services.Infrastructure;
using OJS.Services.Common.Models.Contests.Results;
using System.Threading.Tasks;

public interface IContestResultsBusinessService : IService
{
    Task<ContestResultsViewModel> GetContestResults(int contestId, bool official, bool isFullResults);
}