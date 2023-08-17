namespace OJS.Services.Common.Data.Implementations;

using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using OJS.Data.Models.Submissions;
using FluentExtensions.Extensions;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using OJS.Common;
using OJS.Common.Helpers;

public class SubmissionsForProcessingCommonDataService : DataService<SubmissionForProcessing>, ISubmissionsForProcessingCommonDataService
{
    public SubmissionsForProcessingCommonDataService(DbContext submissionsForProcessing)
        : base(submissionsForProcessing)
    {
    }

    public Task<SubmissionForProcessing?> GetBySubmission(int submissionId) =>
        this.DbSet
            .Where(s => s.SubmissionId == submissionId)
            .FirstOrDefaultAsync();

    public IQueryable<SubmissionForProcessing> GetAllUnprocessedAndNotProcessing() =>
        this.DbSet
            .Where(sfp => !sfp.Processed && !sfp.Processing);

    public IQueryable<SubmissionForProcessing> GetAllUnprocessed() =>
        this.DbSet
            .Where(sfp => !sfp.Processed);

    public async Task<int> GetAllUnprocessedCount()
        => await this
            .GetAllUnprocessed()
            .CountAsync();

    public async Task<IEnumerable<int>> GetIdsOfAllProcessing() =>
        await this.DbSet
            .Where(sfp => sfp.Processing && !sfp.Processed)
            .Select(sfp => sfp.Id)
            .ToListAsync();

    public async Task<IEnumerable<TServiceModel>> GetAllProcessing<TServiceModel>()
        => await this.DbSet
            .Where(sfp => !sfp.Processed && sfp.Processing)
            .MapCollection<TServiceModel>()
            .ToListAsync();

    public async Task Add(int submissionId)
    {
        var submissionForProcessing = new SubmissionForProcessing
        {
            SubmissionId = submissionId,
            Processed = false,
            Processing = false,
        };

        await this.Add(submissionForProcessing);
    }

    public async Task AddOrUpdateBySubmissionIds(ICollection<int> submissionIds)
    {
        var newSubmissionsForProcessing = submissionIds
            .Select(sId => new SubmissionForProcessing
            {
                SubmissionId = sId,
            });

        using var scope = TransactionsHelper.CreateTransactionScope();
        submissionIds
            .Chunk(GlobalConstants.BatchOperationsChunkSize)
            .ForEach(chunk => this.Delete(sfp => chunk.Contains(sfp.SubmissionId)));

        await this.AddMany(newSubmissionsForProcessing);

        scope.Complete();
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

    public async Task ResetProcessingStatusById(int id)
    {
        var submissionForProcessing = await this.OneById(id);
        if (submissionForProcessing != null)
        {
            submissionForProcessing.Processing = false;
            submissionForProcessing.Processed = false;
            await this.SaveChanges();
        }
    }

    public void Clean() =>
        this.DbSet.RemoveRange(this.DbSet.Where(sfp => sfp.Processed && !sfp.Processing));

    public new async Task Update(SubmissionForProcessing submissionForProcessing)
    {
        base.Update(submissionForProcessing);
        await this.SaveChanges();
    }

    public async Task MarkProcessing(int submissionId)
    {
        var submissionForProcessing = await this
            .GetBySubmission(submissionId);

        if (submissionForProcessing == null)
        {
            return;
        }

        submissionForProcessing.Processing = true;
        submissionForProcessing.Processed = false;

        await this.Update(submissionForProcessing);
    }

    public async Task MarkProcessed(int submissionId)
    {
        var submissionForProcessing = await this.GetBySubmission(submissionId);

        if (submissionForProcessing == null)
        {
            return;
        }

        submissionForProcessing.Processing = false;
        submissionForProcessing.Processed = true;

        await this.Update(submissionForProcessing);
        await this.SaveChanges();
    }
}