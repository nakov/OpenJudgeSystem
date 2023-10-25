namespace OJS.Services.Common.Data;

using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using OJS.Data.Models.Submissions;
using Models.Submissions;

public interface ISubmissionsForProcessingCommonDataService : IDataService<SubmissionForProcessing>
{
    IQueryable<SubmissionForProcessing?> GetAllPending();

    IQueryable<SubmissionForProcessing?> GetAllUnprocessed();

    Task<int> GetAllUnprocessedCount();

    Task<IEnumerable<int>> GetIdsOfAllProcessing();

    Task<IEnumerable<TServiceModel>> GetAllProcessing<TServiceModel>();

    Task<SubmissionForProcessing> Add(int submissionId, string serializedExecutionDetails);

    Task<SubmissionForProcessing> AddOrUpdate(int submissionId, string serializedExecutionDetails);

    Task RemoveBySubmission(int submissionId);

    Task ResetProcessingStatusById(int id);

    Task MarkProcessing(int submissionId);

    Task MarkMultipleForProcessing(ICollection<int> submissionsIds);

    Task MarkProcessed(SerializedSubmissionExecutionResultServiceModel submissionExecutionResult);
}