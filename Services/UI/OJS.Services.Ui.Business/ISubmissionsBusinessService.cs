namespace OJS.Services.Ui.Business
{
    using OJS.Common.Enumerations;
    using OJS.Data.Models.Submissions;
    using OJS.Services.Common.Models.Submissions;
    using OJS.Services.Ui.Models.Submissions;
    using OJS.Services.Infrastructure;
    using OJS.Services.Infrastructure.Models;
    using System.Linq;
    using System.Threading.Tasks;
    using static OJS.Services.Common.PaginationConstants.Submissions;

    public interface ISubmissionsBusinessService : IService
    {
        Task Submit(SubmitSubmissionServiceModel model);

        Task Retest(int id);

        Task<SubmissionDetailsServiceModel?> GetById(int submissionId);

        Task<SubmissionDetailsServiceModel> GetDetailsById(int submissionId);

        Task<IQueryable<Submission>> GetAllForArchiving();

        Task RecalculatePointsByProblem(int problemId);

        Task<PagedResult<TServiceModel>> GetByUsername<TServiceModel>(
            string? username,
            int page,
            int itemsInPage = DefaultSubmissionsPerPage);

        Task<PagedResult<SubmissionForProfileServiceModel>> GetForProfileByUserAndContest(string? username, int page, int contestId);

        Task ProcessExecutionResult(SubmissionExecutionResult submissionExecutionResult);

        // Task HardDeleteAllArchived();

        Task<PagedResult<SubmissionResultsServiceModel>> GetSubmissionResults(int submissionId, int page);

        Task<PagedResult<TServiceModel>> GetUserSubmissionsByProblem<TServiceModel>(int problemId, bool isOfficial, int page);

        Task<int> GetTotalCount();

        Task<PagedResult<TServiceModel>> GetSubmissions<TServiceModel>(
            SubmissionStatus status,
            int page,
            int itemsPerPage = DefaultSubmissionsPerPage);

        SubmissionFileDownloadServiceModel GetSubmissionFile(int submissionId);

        Task<int> GetAllUnprocessedCount();
    }
}