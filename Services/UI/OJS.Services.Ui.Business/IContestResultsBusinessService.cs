namespace OJS.Services.Ui.Business;

using OJS.Services.Common.Models.Contests.Results;
using OJS.Services.Infrastructure;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IContestResultsBusinessService : IService
{
    Task<ContestResultsViewModel> GetContestResults(int contestId, bool official, bool isFullResults, int page);

    Task<IEnumerable<UserPercentageResultsServiceModel?>> GetAllUserResultsPercentageByForContest(int? contestId);
}