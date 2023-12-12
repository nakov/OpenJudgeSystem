namespace OJS.Services.Common;

using SoftUni.Services.Infrastructure;
using OJS.Services.Common.Models.Contests.Results;

public interface IContestResultsAggregatorCommonService : IService
{
    ContestResultsViewModel GetContestResults(ContestResultsModel contestResultsModel);
}