namespace OJS.Services.Common;

using OJS.Data.Models.Contests;
using OJS.Services.Common.Models.Contests.Results;
using SoftUni.Services.Infrastructure;

public interface IContestResultsAggregatorService : IService
{
    ContestResultsViewModel GetContestResults(
        Contest contest,
        bool official,
        bool isUserAdminOrLecturer,
        bool isFullResults,
        bool isExportResults = false);
}