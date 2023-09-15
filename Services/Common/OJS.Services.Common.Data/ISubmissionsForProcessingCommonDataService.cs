namespace OJS.Services.Common.Data;

using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using OJS.Data.Models.Submissions;
using SoftUni.Services.Infrastructure;

public interface ISubmissionsForProcessingCommonDataService : IService
{
    IQueryable<SubmissionForProcessing?> GetAllPending();

    IQueryable<SubmissionForProcessing?> GetAllUnprocessed();

    Task<int> GetAllUnprocessedCount();

    Task<IEnumerable<int>> GetIdsOfAllProcessing();

    Task<IEnumerable<TServiceModel>> GetAllProcessing<TServiceModel>();

    Task<SubmissionForProcessing> Add(int submissionId);

    Task<SubmissionForProcessing> CreateIfNotExists(int submissionId);

    Task AddOrUpdateBySubmissionIds(ICollection<int> submissionIds);

    Task RemoveBySubmission(int submissionId);

    Task ResetProcessingStatusById(int id);

    Task MarkProcessing(int submissionId);

    Task MarkProcessed(int submissionId);

    void Clean();
}