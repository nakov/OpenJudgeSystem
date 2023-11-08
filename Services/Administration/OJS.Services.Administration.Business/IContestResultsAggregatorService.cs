namespace OJS.Services.Administration.Business;

using OJS.Services.Ui.Models.Contests;
using OJS.Services.Common.Models.Contests.Results;
using SoftUni.Services.Infrastructure;

public interface IContestResultsAggregatorService : IService
{
    ContestResultsViewModel GetContestResults(ContestResultsModel contestResultsModel);
}