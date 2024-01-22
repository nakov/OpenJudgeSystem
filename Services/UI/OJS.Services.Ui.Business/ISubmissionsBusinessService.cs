namespace OJS.Services.Ui.Business
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using OJS.Common.Enumerations;
    using OJS.Data.Models.Submissions;
    using OJS.Services.Common.Models.Submissions;
    using OJS.Services.Ui.Models.Submissions;
    using SoftUni.Common.Models;
    using SoftUni.Services.Infrastructure;

    public interface ISubmissionsBusinessService : IService
    {
        Task Submit(SubmitSubmissionServiceModel model);

        Task Retest(int id);

        Task<SubmissionDetailsServiceModel?> GetById(int submissionId);

        Task<SubmissionDetailsServiceModel> GetDetailsById(int submissionId);

        Task<IQueryable<Submission>> GetAllForArchiving();

        Task RecalculatePointsByProblem(int problemId);

        Task<PagedResult<SubmissionForProfileServiceModel>> GetForProfileByUser(string? username, int page);

        Task<PagedResult<SubmissionForProfileServiceModel>> GetForProfileByUserAndContest(string? username, int page, int contestId);

        Task ProcessExecutionResult(SubmissionExecutionResult submissionExecutionResult);

        // Task HardDeleteAllArchived();

        Task<PagedResult<SubmissionResultsServiceModel>> GetSubmissionResults(int submissionId, int page);

        Task<PagedResult<SubmissionResultsServiceModel>> GetSubmissionResultsByProblem(int problemId, bool isOfficial, int page);

        Task<PagedResult<SubmissionForPublicSubmissionsServiceModel>> GetUsersLastSubmissions(bool? isOfficial, int page);

        Task<PagedResult<SubmissionForPublicSubmissionsServiceModel>> GetByContest(int contestId, int page);

        Task<int> GetTotalCount();

        Task<PagedResult<SubmissionForPublicSubmissionsServiceModel>> GetSubmissions(SubmissionStatus status, int page);

        SubmissionFileDownloadServiceModel GetSubmissionFile(int submissionId);
    }
}