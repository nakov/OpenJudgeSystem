namespace OJS.Services.Common.Data.Implementations
{
    using FluentExtensions.Extensions;
    using Microsoft.EntityFrameworkCore;
    using OJS.Common;
    using OJS.Common.Helpers;
    using OJS.Data.Models.Submissions;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    public class SubmissionsForProcessingDataService : DataService<SubmissionForProcessing>,
        ISubmissionsForProcessingDataService
    {
        public SubmissionsForProcessingDataService(DbContext submissionsForProcessing)
            : base(submissionsForProcessing)
        {
        }

        public Task<SubmissionForProcessing?> GetBySubmission(int submissionId) =>
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
                .Select(sId => new SubmissionForProcessing { SubmissionId = sId });

            using (var scope = TransactionsHelper.CreateTransactionScope())
            {
                submissionIds
                    .Chunk(GlobalConstants.BatchOperationsChunkSize)
                    .ForEach(chunk => this.Delete(sfp => Enumerable.Contains(chunk, sfp.SubmissionId)));

                await this.AddMany(newSubmissionsForProcessing);

                scope.Complete();
            }
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
                submissionForProcessing = new SubmissionForProcessing { SubmissionId = submissionId };

                await this.Add(submissionForProcessing);
                await this.SaveChanges();
            }
        }

        public async Task RemoveBySubmission(int submissionId)
        {
            var submissionForProcessing = await this.GetBySubmission(submissionId);

            if (submissionForProcessing != null)
            {
                await this.DeleteById(submissionId);
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
    }
}