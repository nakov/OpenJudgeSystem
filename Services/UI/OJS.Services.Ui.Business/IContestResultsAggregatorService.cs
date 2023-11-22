namespace OJS.Services.Ui.Business;

using OJS.Data.Models.Contests;
using OJS.Services.Common.Models.Contests.Results;
using SoftUni.Services.Infrastructure;

public interface IContestResultsAggregatorService : IService
{
    ContestResultsViewModel GetContestResults(ContestResultsModel contestResultsModel);
}