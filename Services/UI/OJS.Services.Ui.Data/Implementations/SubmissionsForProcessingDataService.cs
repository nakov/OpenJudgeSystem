namespace OJS.Services.Ui.Data.Implementations
{
    using FluentExtensions.Extensions;
    using Microsoft.EntityFrameworkCore;
    using OJS.Common;
    using OJS.Common.Helpers;
    using OJS.Data.Models.Submissions;
    using OJS.Services.Common.Data.Implementations;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;


    public class SubmissionsForProcessingDataService : DataService<SubmissionForProcessing>, ISubmissionsForProcessingDataService
    {
        public SubmissionsForProcessingDataService(DbContext submissionsForProcessing) : base(submissionsForProcessing) {}

        public Task<SubmissionForProcessing> GetBySubmission(int submissionId) =>
            this.DbSet
                .Where(s => s.SubmissionId == submissionId)
                .FirstOrDefaultAsync();

        public IQueryable<SubmissionForProcessing> GetAllUnprocessed() =>
            this.DbSet
                .Where(sfp => !sfp.Processed && !sfp.Processing);

        public async Task<IEnumerable<int>> GetIdsOfAllProcessing() =>
            await this.DbSet
                .Where(sfp => sfp.Processing && !sfp.Processed)
                .Select(sfp => sfp.Id)
                .ToListAsync();

        public async Task AddOrUpdateBySubmissionIds(ICollection<int> submissionIds)
        {
            var newSubmissionsForProcessing = submissionIds
                .Select(sId => new SubmissionForProcessing
                {
                    SubmissionId = sId
                });

            using var scope = TransactionsHelper.CreateTransactionScope();
            await submissionIds
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

        public async Task AddOrUpdateBySubmission(int submissionId)
        {
            var submissionForProcessing = await this.GetBySubmission(submissionId);

            if (submissionForProcessing != null)
            {
                submissionForProcessing.Processing = false;
                submissionForProcessing.Processed = false;
            }
            else
            {
                submissionForProcessing = new SubmissionForProcessing
                {
                    SubmissionId = submissionId
                };

                await base.Add(submissionForProcessing);
                await base.SaveChanges();
            }
        }

        public async Task RemoveBySubmission(int submissionId)
        {
            var submissionForProcessing = this.GetBySubmission(submissionId);

            if (submissionForProcessing != null)
            {
                await base.DeleteById(submissionId);
                await base.SaveChanges();
            }
        }

        public async Task ResetProcessingStatusById(int id)
        {
            var submissionForProcessing = await base.OneById(id);
            if (submissionForProcessing != null)
            {
                submissionForProcessing.Processing = false;
                submissionForProcessing.Processed = false;
                await base.SaveChanges();
            }
        }

        public void Clean() =>
            this.DbSet.RemoveRange(this.DbSet.Where(sfp => sfp.Processed && !sfp.Processing));
    }
}