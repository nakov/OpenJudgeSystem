namespace OJS.Services.Ui.Data
{
    using OJS.Data.Models.Submissions;
    using SoftUni.Services.Infrastructure;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    public interface ISubmissionsForProcessingDataService : IService
    {
        Task<SubmissionForProcessing?> GetBySubmission(int submissionId);

        Task<int> GetAllUnprocessedCount();

        IQueryable<SubmissionForProcessing> GetAllUnprocessed();

        Task<IEnumerable<int>> GetIdsOfAllProcessing();

        Task AddOrUpdateBySubmissionIds(ICollection<int> submissionIds);

        Task AddOrUpdateReprocessingBySubmission(int submissionId);

        Task EndProcessingBySubmission(int submissionId);

        Task RemoveBySubmission(int submissionId);

        Task ResetProcessingStatusById(int id);

        Task Update(SubmissionForProcessing submissionForProcessing);

        void Clean();
    }
}