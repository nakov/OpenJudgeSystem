namespace OJS.Services.Administration.Business.Contests;

using OJS.Data.Models.Contests;
using OJS.Services.Administration.Models.Contests;
using OJS.Services.Administration.Models.Submissions;
using OJS.Services.Common.Models.Files;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IContestsBusinessService : IAdministrationOperationService<Contest, int, ContestAdministrationModel>
{
    Task<bool> UserHasContestPermissions(int contestId, string? userId, bool isUserAdmin);

    Task<IEnumerable<TServiceModel>> GetAllAvailableForCurrentUser<TServiceModel>(string searchString)
        where TServiceModel : class;

    Task<FileResponseModel> ExportResults(ContestResultsExportRequestModel model);

    Task<FileResponseModel> DownloadSubmissions(DownloadSubmissionsModel model);

    Task<ContestActivityModel> GetContestActivity(int contestId);

    Task TransferParticipantsToPracticeById(int contestId);
}