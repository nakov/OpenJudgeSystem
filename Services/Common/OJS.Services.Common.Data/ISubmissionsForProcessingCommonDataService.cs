namespace OJS.Services.Common.Data;

using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using OJS.Data.Models.Submissions;

public interface ISubmissionsForProcessingCommonDataService : IDataService<SubmissionForProcessing>
{
    Task<SubmissionForProcessing?> GetBySubmission(int submissionId);

    IQueryable<SubmissionForProcessing> GetAllPending();

    IQueryable<SubmissionForProcessing> GetAllEnqueued();

    IQueryable<SubmissionForProcessing> GetAllUnprocessed();

    IQueryable<SubmissionForProcessing> GetAllProcessing();

    Task<SubmissionForProcessing> Add(int submissionId);

    Task<SubmissionForProcessing> AddOrUpdate(int submissionId);

    Task AddOrUpdateMany(ICollection<int> submissionIds);

    Task RemoveBySubmission(int submissionId);

    void MarkEnqueued(SubmissionForProcessing submissionForProcessing);

    void MarkProcessing(SubmissionForProcessing submissionForProcessing);

    Task MarkMultipleEnqueued(ICollection<int> submissionIds);

    void MarkProcessed(SubmissionForProcessing submissionForProcessing);
}