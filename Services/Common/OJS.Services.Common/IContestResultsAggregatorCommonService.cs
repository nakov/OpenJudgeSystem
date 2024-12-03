namespace OJS.Services.Common;

using OJS.Services.Common.Models.Contests;
using OJS.Services.Infrastructure;
using OJS.Services.Common.Models.Contests.Results;

public interface IContestResultsAggregatorCommonService : IService
{
    ContestResultsViewModel GetContestResults(ContestResultsModel contestResultsModel, IContestActivityServiceModel contestActivity);
}