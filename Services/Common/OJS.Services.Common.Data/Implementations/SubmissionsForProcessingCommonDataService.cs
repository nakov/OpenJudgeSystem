namespace OJS.Services.Common.Data.Implementations;

using FluentExtensions.Extensions;
using Microsoft.EntityFrameworkCore;
using OJS.Common;
using OJS.Common.Helpers;
using OJS.Data;
using OJS.Data.Models.Submissions;
using OJS.Services.Common.Models.Submissions;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Transactions;

public class SubmissionsForProcessingCommonDataService : DataService<SubmissionForProcessing>, ISubmissionsForProcessingCommonDataService
{
    public SubmissionsForProcessingCommonDataService(OjsDbContext submissionsForProcessing)
        : base(submissionsForProcessing)
    {
    }

    public Task<SubmissionForProcessing?> GetBySubmission(int submissionId)
        => this.DbSet
            .Where(s => s.SubmissionId == submissionId)
            .FirstOrDefaultAsync();

    public IQueryable<SubmissionForProcessing> GetAllPending()
        => this.DbSet
            .Where(sfp => !sfp.Processed && !sfp.Processing);

    public IQueryable<SubmissionForProcessing> GetAllUnprocessed()
        => this.DbSet
            .Where(sfp => !sfp.Processed);

    public IQueryable<SubmissionForProcessing> GetAllProcessing()
        => this.DbSet
            .Where(sfp => !sfp.Processed && sfp.Processing);

    public async Task<SubmissionForProcessing> Add(int submissionId, string serializedExecutionDetails)
    {
        var submissionForProcessing = new SubmissionForProcessing
        {
            SubmissionId = submissionId,
            Processed = false,
            Processing = false,
            SerializedExecutionDetails = serializedExecutionDetails,
        };

        await this.Add(submissionForProcessing);

        return submissionForProcessing;
    }

    public async Task<SubmissionForProcessing> AddOrUpdate(int submissionId, string serializedExecutionDetails)
    {
        var entity = await this.GetBySubmission(submissionId) ?? await this.Add(submissionId, serializedExecutionDetails);

        entity.Processing = false;
        entity.Processed = false;

        return entity;
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

    public async Task MarkMultipleForProcessing(ICollection<int> submissionsIds)
    {
        var newSubmissionsForProcessing = submissionsIds
            .Select(sId => new SubmissionForProcessing
            {
                SubmissionId = sId,
                Processed = false,
                Processing = true,
            });

        using var scope = TransactionsHelper.CreateTransactionScope(
            isolationLevel: IsolationLevel.RepeatableRead,
            asyncFlowOption: TransactionScopeAsyncFlowOption.Enabled);

        await submissionsIds
            .Chunk(GlobalConstants.BatchOperationsChunkSize)
            .ForEachSequential(async chunk =>
            {
                this.Delete(sfp => chunk.Contains(sfp.SubmissionId));
                await this.SaveChanges();
            });

        await this.AddMany(newSubmissionsForProcessing);

        await this.SaveChanges();

        scope.Complete();
    }

    public async Task MarkProcessed(SerializedSubmissionExecutionResultServiceModel submissionExecutionResult)
    {
        var submissionForProcessing = await this.GetBySubmission(submissionExecutionResult.SubmissionId);

        if (submissionForProcessing == null)
        {
            return;
        }

        submissionForProcessing.Processing = false;
        submissionForProcessing.Processed = true;
        submissionForProcessing.SerializedException = submissionExecutionResult.SerializedException;
        submissionForProcessing.SerializedExecutionResult = submissionExecutionResult.SerializedExecutionResult;

        await this.Update(submissionForProcessing);
    }
}