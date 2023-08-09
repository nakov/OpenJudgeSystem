namespace OJS.Services.Ui.Business
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using OJS.Data.Models.Submissions;
    using OJS.Services.Common.Models.Submissions;
    using OJS.Services.Ui.Models.Submissions;
    using SoftUni.Common.Models;
    using SoftUni.Services.Infrastructure;

    public interface ISubmissionsBusinessService : IService
    {
        Task Submit(SubmitSubmissionServiceModel model);

        Task<SubmissionDetailsServiceModel?> GetById(int submissionId);

        Task<SubmissionDetailsServiceModel> GetDetailsById(int submissionId);

        Task<IQueryable<Submission>> GetAllForArchiving();

        Task RecalculatePointsByProblem(int problemId);

        Task<IEnumerable<SubmissionForProfileServiceModel>> GetForProfileByUser(string? username);

        Task<IEnumerable<SubmissionResultsServiceModel>> GetSubmissionResultsByProblem(int problemId, bool isOfficial, int take = 0);

        Task<IEnumerable<SubmissionResultsServiceModel>> GetSubmissionDetailsResults(int submissionId, bool isOfficial, int take = 0);

        Task ProcessExecutionResult(SubmissionExecutionResult submissionExecutionResult);

        // Task HardDeleteAllArchived();

        Task<PagedResult<SubmissionForPublicSubmissionsServiceModel>> GetPublicSubmissions(SubmissionForPublicSubmissionsServiceModel model);

        Task<PagedResult<SubmissionForPublicSubmissionsServiceModel>> GetProcessingSubmissions(int page);

        Task<int> GetTotalCount();

        SubmissionFileDownloadServiceModel GetSubmissionFile(int submissionId);
    }
}