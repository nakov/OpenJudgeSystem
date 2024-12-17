namespace OJS.Services.Common.Data;

using OJS.Services.Common.Models.Contests;
using OJS.Services.Common.Models.Contests.Results;
using OJS.Services.Infrastructure;

public interface IContestResultsAggregatorCommonService : IService
{
    ContestResultsViewModel GetContestResults(ContestResultsModel contestResultsModel, IContestActivityServiceModel contestActivity);
}