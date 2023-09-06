namespace OJS.Services.Common.Data;

using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using OJS.Data.Models.Submissions;
using SoftUni.Services.Infrastructure;
using Models.Submissions;

public interface ISubmissionsForProcessingCommonDataService : IService
{
    IQueryable<SubmissionForProcessing?> GetAllPending();

    IQueryable<SubmissionForProcessing?> GetAllUnprocessed();

    Task<int> GetAllUnprocessedCount();

    Task<IEnumerable<int>> GetIdsOfAllProcessing();

    Task<IEnumerable<TServiceModel>> GetAllProcessing<TServiceModel>();

    Task Add(int submissionId, string serializedExecutionDetails);

    Task<SubmissionForProcessing> AddOrUpdate(int submissionId, string serializedExecutionDetails);

    Task AddOrUpdateBySubmissionIds(ICollection<int> submissionIds);

    Task RemoveBySubmission(int submissionId);

    Task ResetProcessingStatusById(int id);

    Task MarkProcessing(int submissionId);

    Task MarkProcessedAndSerializeWorkerResult(SubmissionExecutionResultServiceModel submissionExecutionResult);

    void Clean();
}