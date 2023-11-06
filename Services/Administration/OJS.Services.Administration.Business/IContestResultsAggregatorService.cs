namespace OJS.Services.Administration.Business;

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
        bool isExportResults = false,
        int? totalResultsCount = null,
        int page = 1,
        int itemsInPage = int.MaxValue);
}