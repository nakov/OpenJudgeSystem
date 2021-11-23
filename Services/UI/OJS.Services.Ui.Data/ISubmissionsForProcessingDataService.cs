namespace OJS.Services.Ui.Data
{
    using OJS.Data.Models.Submissions;
    using SoftUni.Services.Infrastructure;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    public interface ISubmissionsForProcessingDataService : IService
    {
        Task<SubmissionForProcessing> GetBySubmission(int submissionId);

        IQueryable<SubmissionForProcessing> GetAllUnprocessed();

        Task<IEnumerable<int>> GetIdsOfAllProcessing();

        Task AddOrUpdateBySubmissionIds(ICollection<int> submissionIds);

        Task AddOrUpdateBySubmission(int submissionId);

        Task RemoveBySubmission(int submissionId);

        Task ResetProcessingStatusById(int id);

        void Clean();
    }
}