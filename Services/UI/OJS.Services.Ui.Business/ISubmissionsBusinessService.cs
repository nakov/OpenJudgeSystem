namespace OJS.Services.Ui.Business
{
    using OJS.Data.Models.Submissions;
    using SoftUni.Services.Infrastructure;
    using System.Linq;
    using System.Threading.Tasks;
    using Models.Submissions;
    using System.Collections.Generic;

    public interface ISubmissionsBusinessService : IService
    {
        Task Submit(SubmitSubmissionServiceModel model);

        Task<SubmissionDetailsServiceModel?> GetById(int submissionId);

        Task<SubmissionDetailsServiceModel?> GetDetailsById(int submissionId);

        Task<IEnumerable<SubmissionServiceModel>> GetAllForArchiving();

        Task RecalculatePointsByProblem(int problemId);

        Task<IEnumerable<SubmissionForProfileServiceModel>> GetForProfileByUser(string? username);

        Task<IEnumerable<SubmissionResultsServiceModel>> GetSubmissionResultsByProblem(int problemId, bool isOfficial,
            int take = 0);

        Task<IEnumerable<SubmissionResultsServiceModel>> GetSubmissionResultsByProblemAndUser(
            int problemId,
            bool isOfficial,
            string userId,
            int? take
        );

        Task ProcessExecutionResult(SubmissionExecutionResult submissionExecutionResult);

        // Task HardDeleteAllArchived();

        Task<IEnumerable<SubmissionForPublicSubmissionsServiceModel>> GetPublicSubmissions();

        Task<int> GetTotalCount();
    }
}