namespace OJS.Services.Common.Data.Implementations;

using FluentExtensions.Extensions;
using Microsoft.EntityFrameworkCore;
using OJS.Common;
using OJS.Common.Enumerations;
using OJS.Data;
using OJS.Data.Models.Submissions;
using OJS.Services.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class SubmissionsForProcessingCommonDataService(
    OjsDbContext submissionsForProcessing,
    IDatesService dates)
    : DataService<SubmissionForProcessing>(submissionsForProcessing), ISubmissionsForProcessingCommonDataService
{
    public Task<SubmissionForProcessing?> GetBySubmission(int submissionId)
        => this.GetQuery(s => s.SubmissionId == submissionId)
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync();

    public IQueryable<SubmissionForProcessing> GetAllPending(int? fromMinutesAgo)
        => fromMinutesAgo is null
            ? this.GetQuery(sfp => sfp.State == SubmissionProcessingState.Pending)
            : this.GetQuery(sfp => sfp.State == SubmissionProcessingState.Pending
                && sfp.ModifiedOn < dates.GetUtcNow().AddMinutes(-fromMinutesAgo.Value));

    public IQueryable<SubmissionForProcessing> GetAllEnqueued()
        => this.GetQuery(sfp => sfp.State == SubmissionProcessingState.Enqueued);

    public IQueryable<SubmissionForProcessing> GetAllUnprocessed()
        => this.GetQuery(sfp => sfp.State != SubmissionProcessingState.Processed);

    public IQueryable<SubmissionForProcessing> GetAllProcessing()
        => this.GetQuery(sfp => sfp.State == SubmissionProcessingState.Processing);

    public IQueryable<SubmissionForProcessing> GetAllProcessed(int fromMinutesAgo)
        => this.GetQuery(sfp => sfp.State == SubmissionProcessingState.Processed
            && sfp.ProcessedAt < dates.GetUtcNowOffset().AddMinutes(-fromMinutesAgo));

    public async Task<SubmissionForProcessing> Add(int submissionId)
    {
        var submissionForProcessing = new SubmissionForProcessing
        {
            SubmissionId = submissionId,
            State = SubmissionProcessingState.Pending,
        };

        await this.Add(submissionForProcessing);

        return submissionForProcessing;
    }

    public async Task<SubmissionForProcessing> AddOrUpdate(int submissionId)
    {
        var entity = await this.GetBySubmission(submissionId);

        if (entity is null)
        {
            entity = await this.Add(submissionId);
        }
        else
        {
            entity.State = SubmissionProcessingState.Pending;

            this.Update(entity);
        }

        return entity;
    }

    public async Task AddOrUpdateMany(ICollection<int> submissionIds)
    {
        var newSubmissionsForProcessing = submissionIds
            .Select(sId => new SubmissionForProcessing
            {
                SubmissionId = sId,
            });

        await submissionIds
            .Chunk(GlobalConstants.BatchOperationsChunkSize)
            .ForEachSequential(async chunk =>
            {
                this.Delete(sfp => chunk.Contains(sfp.SubmissionId));
                await this.SaveChanges();
            });

        await this.AddMany(newSubmissionsForProcessing);
        await this.SaveChanges();
    }

    public async Task RemoveBySubmission(int submissionId)
    {
        var submissionForProcessing = await this.GetBySubmission(submissionId);

        if (submissionForProcessing != null)
        {
            await this.DeleteById(submissionForProcessing.Id);
            await this.SaveChanges();
        }
    }

    public async Task MarkEnqueued(SubmissionForProcessing submissionForProcessing, DateTimeOffset? enqueuedAt = null)
    {
        submissionForProcessing.State = SubmissionProcessingState.Enqueued;
        submissionForProcessing.EnqueuedAt = enqueuedAt ?? dates.GetUtcNowOffset();

        this.Update(submissionForProcessing);
        await this.SaveChanges();
    }

    public async Task<int> MarkMultipleEnqueued(ICollection<int> submissionIds, DateTimeOffset? enqueuedAt = null)
    {
        var enqueuedAtDate = enqueuedAt ?? dates.GetUtcNowOffset();
        return await this.GetQuery(sfp => submissionIds.Contains(sfp.SubmissionId))
            .IgnoreQueryFilters()
            .UpdateFromQueryAsync(sfp => new SubmissionForProcessing
            {
                State = SubmissionProcessingState.Enqueued,
                EnqueuedAt = enqueuedAtDate,
            });
    }

    public async Task MarkProcessing(SubmissionForProcessing submissionForProcessing, DateTimeOffset? processingStartedAt = null)
    {
        submissionForProcessing.State = SubmissionProcessingState.Processing;
        submissionForProcessing.ProcessingStartedAt = processingStartedAt ?? dates.GetUtcNowOffset();

        this.Update(submissionForProcessing);
        await this.SaveChanges();
    }

    public async Task MarkProcessed(SubmissionForProcessing submissionForProcessing, DateTimeOffset? processedAt = null)
    {
        submissionForProcessing.State = SubmissionProcessingState.Processed;
        submissionForProcessing.ProcessedAt = processedAt ?? dates.GetUtcNowOffset();

        this.Update(submissionForProcessing);
        await this.SaveChanges();
    }
}