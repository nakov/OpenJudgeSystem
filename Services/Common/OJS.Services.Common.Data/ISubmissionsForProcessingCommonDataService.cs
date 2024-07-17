namespace OJS.Services.Common.Data;

using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using OJS.Data.Models.Submissions;
using OJS.Services.Common.Models.Submissions;

public interface ISubmissionsForProcessingCommonDataService : IDataService<SubmissionForProcessing>
{
    Task<SubmissionForProcessing?> GetBySubmission(int submissionId);

    IQueryable<SubmissionForProcessing> GetAllPending();

    IQueryable<SubmissionForProcessing> GetAllUnprocessed();

    IQueryable<SubmissionForProcessing> GetAllProcessing();

    Task<SubmissionForProcessing> Add(int submissionId, string serializedExecutionDetails);

    Task<SubmissionForProcessing> AddOrUpdate(int submissionId, string serializedExecutionDetails);

    Task AddOrUpdateMany(ICollection<int> submissionIds);

    Task RemoveBySubmission(int submissionId);

    void MarkProcessing(SubmissionForProcessing submissionForProcessing);

    Task MarkMultipleForProcessing(ICollection<int> submissionIds);

    void MarkProcessed(SubmissionForProcessing submissionForProcessing, SerializedSubmissionExecutionResultServiceModel submissionExecutionResult);
}