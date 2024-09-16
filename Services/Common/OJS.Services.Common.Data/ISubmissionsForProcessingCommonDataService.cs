namespace OJS.Services.Common.Data;

using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using OJS.Data.Models.Submissions;
using System;

public interface ISubmissionsForProcessingCommonDataService : IDataService<SubmissionForProcessing>
{
    Task<SubmissionForProcessing?> GetBySubmission(int submissionId);

    IQueryable<SubmissionForProcessing> GetAllPending(int? fromMinutesAgo);

    IQueryable<SubmissionForProcessing> GetAllEnqueued();

    IQueryable<SubmissionForProcessing> GetAllUnprocessed();

    IQueryable<SubmissionForProcessing> GetAllProcessing();

    IQueryable<SubmissionForProcessing> GetAllProcessed(int fromMinutesAgo);

    Task<SubmissionForProcessing> Add(int submissionId);

    Task<SubmissionForProcessing> AddOrUpdate(int submissionId);

    Task AddOrUpdateMany(ICollection<int> submissionIds);

    Task RemoveBySubmission(int submissionId);

    Task MarkEnqueued(SubmissionForProcessing submissionForProcessing, DateTimeOffset? enqueuedAt = null);

    Task<int> MarkMultipleEnqueued(ICollection<int> submissionIds, DateTimeOffset? enqueuedAt = null);

    Task MarkProcessing(SubmissionForProcessing submissionForProcessing, DateTimeOffset? processingStartedAt = null);

    Task MarkProcessed(SubmissionForProcessing submissionForProcessing, DateTimeOffset? processedAt = null);
}