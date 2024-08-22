namespace OJS.Services.Common.Data.Implementations;

using FluentExtensions.Extensions;
using Microsoft.EntityFrameworkCore;
using OJS.Common;
using OJS.Data;
using OJS.Data.Models.Submissions;
using OJS.Services.Common.Models.Submissions;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class SubmissionsForProcessingCommonDataService : DataService<SubmissionForProcessing>, ISubmissionsForProcessingCommonDataService
{
    public SubmissionsForProcessingCommonDataService(OjsDbContext submissionsForProcessing)
        : base(submissionsForProcessing)
    {
    }

    public Task<SubmissionForProcessing?> GetBySubmission(int submissionId)
        => this.GetQuery(s => s.SubmissionId == submissionId)
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync();

    public IQueryable<SubmissionForProcessing> GetAllPending()
        => this.GetQuery(sfp => !sfp.Processed && !sfp.Processing);

    public IQueryable<SubmissionForProcessing> GetAllUnprocessed()
        => this.GetQuery(sfp => !sfp.Processed);

    public IQueryable<SubmissionForProcessing> GetAllProcessing()
        => this.GetQuery(sfp => !sfp.Processed && sfp.Processing);

    public async Task<SubmissionForProcessing> Add(int submissionId)
    {
        var submissionForProcessing = new SubmissionForProcessing
        {
            SubmissionId = submissionId,
            Processed = false,
            Processing = false,
        };

        await this.Add(submissionForProcessing);

        return submissionForProcessing;
    }

    public async Task<SubmissionForProcessing> AddOrUpdate(int submissionId)
    {
        var entity = await this.GetBySubmission(submissionId) ?? await this.Add(submissionId);

        entity.Processing = false;
        entity.Processed = false;

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

    public void MarkProcessing(SubmissionForProcessing submissionForProcessing)
    {
        submissionForProcessing.Processing = true;
        submissionForProcessing.Processed = false;

        this.Update(submissionForProcessing);
    }

    public Task MarkMultipleForProcessing(ICollection<int> submissionIds)
     => this.GetQuery(sfp => submissionIds.Contains(sfp.SubmissionId))
            .IgnoreQueryFilters()
            .UpdateFromQueryAsync(sfp => new SubmissionForProcessing
            {
                Processing = true,
                Processed = false,
            });

    public void MarkProcessed(SubmissionForProcessing submissionForProcessing)
    {
        submissionForProcessing.Processing = false;
        submissionForProcessing.Processed = true;

        this.Update(submissionForProcessing);
    }
}