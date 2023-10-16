namespace OJS.Services.Ui.Business;

using OJS.Services.Common.Models.Contests.Results;
using SoftUni.Services.Infrastructure;

public interface IContestResultsAggregatorService : IService
{
    ContestResultsServiceModel GetContestResults(
        ContestResultsServiceModel contest,
        bool official,
        bool isUserAdminOrLecturer,
        bool isFullResults,
        bool isExportResults = false);
}