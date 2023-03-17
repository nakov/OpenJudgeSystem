namespace OJS.Services.Business.Submissions.ArchivedSubmissions
{
    using System;
    using System.Linq;
    using Hangfire.Server;
    using NPOI.SS.Formula.Functions;
    using OJS.Common;
    using OJS.Common.Extensions;
    using OJS.Data.Models;
    using OJS.Services.Common.BackgroundJobs;
    using OJS.Services.Data.Submissions;
    using OJS.Services.Data.Submissions.ArchivedSubmissions;

    public class ArchivedSubmissionsBusinessService : IArchivedSubmissionsBusinessService
    {
        private readonly IArchivedSubmissionsDataService archivedSubmissionsData;
        private readonly ISubmissionsBusinessService submissionsBusiness;
        private readonly ISubmissionsDataService submissionsData;
        private readonly IHangfireBackgroundJobService backgroundJobs;

        public ArchivedSubmissionsBusinessService(
            IArchivedSubmissionsDataService archivedSubmissionsData,
            ISubmissionsBusinessService submissionsBusiness,
            ISubmissionsDataService submissionsData,
            IHangfireBackgroundJobService backgroundJobs)
        {
            this.archivedSubmissionsData = archivedSubmissionsData;
            this.submissionsBusiness = submissionsBusiness;
            this.submissionsData = submissionsData;
            this.backgroundJobs = backgroundJobs;
        }

        public int ArchiveOldSubmissionsDailyBatch(PerformContext context, int limit)
        {
            var maxSubBatchSize = 50000;
            var leftover = limit % maxSubBatchSize;
            var iterations = limit / maxSubBatchSize + (leftover > 0 ? 1 : 0);
            var archived = 0;
            var deletedCount = 0;
            this.archivedSubmissionsData.CreateDatabaseIfNotExists();

            for (var i = 0; i < iterations; i++)
            {
                var curBatchSize = (i == iterations - 1 && leftover > 0) ? leftover : maxSubBatchSize;
                var allSubmissionsForArchive = this.submissionsBusiness
                                .GetAllForArchiving()
                                .OrderBy(x => x.Id)
                                .Take(curBatchSize)
                                .InBatches(GlobalConstants.BatchOperationsChunkSize);

                foreach (var submissionsForArchiveBatch in allSubmissionsForArchive)
                {
                    var submissionsForArchives = submissionsForArchiveBatch
                        .Select(ArchivedSubmission.FromSubmission)
                        .ToList();

                    archived += this.archivedSubmissionsData.Add(submissionsForArchives);
                }

                deletedCount += this.submissionsBusiness.HardDeleteArchived(curBatchSize);
            }

            return deletedCount;
        }

        public int ArchiveOldSubmissionsWithLimit(PerformContext context, int limit)
        {
            var archived = 0;
            this.archivedSubmissionsData.CreateDatabaseIfNotExists();

            var allSubmissionsForArchive = this.submissionsBusiness
                .GetAllForArchiving()
                .OrderBy(x => x.Id)
                .Take(limit)
                .InBatches(GlobalConstants.BatchOperationsChunkSize);

            foreach (var submissionsForArchiveBatch in allSubmissionsForArchive)
            {
                var submissionsForArchives = submissionsForArchiveBatch
                    .Select(ArchivedSubmission.FromSubmission)
                    .ToList();

                archived += this.archivedSubmissionsData.Add(submissionsForArchives);
            }

            this.backgroundJobs.OnSucceededStateContinueWith<IArchivedSubmissionsBusinessService>(
               context.BackgroundJob.Id,
               s => s.HardDeleteArchivedByLimit(context, limit));

            return archived;
        }

        public void ArchiveOldSubmissions(PerformContext context)
        {
            this.archivedSubmissionsData.CreateDatabaseIfNotExists();

            var allSubmissionsForArchive = this.submissionsBusiness
                .GetAllForArchiving()
                .OrderBy(x => x.Id)
                .InBatches(GlobalConstants.BatchOperationsChunkSize);

            foreach (var submissionsForArchiveBatch in allSubmissionsForArchive)
            {
                var submissionsForArchives = submissionsForArchiveBatch
                    .Select(ArchivedSubmission.FromSubmission)
                    .ToList();

                this.archivedSubmissionsData.Add(submissionsForArchives);
            }

            this.backgroundJobs.OnSucceededStateContinueWith<IArchivedSubmissionsBusinessService>(
                context.BackgroundJob.Id,
                s => s.HardDeleteCurrentArchived(context));
        }

        public void HardDeleteCurrentArchived(PerformContext context)
        {
            var deletedCount = this.submissionsBusiness.HardDeleteAllArchived();
            if (deletedCount > 0)
            {
                this.backgroundJobs.AddFireAndForgetJob<IArchivedSubmissionsBusinessService>(
                    s => s.ArchiveOldSubmissions(context));
            }
        }

        public int HardDeleteArchivedByLimit(PerformContext context, int limit)
            => this.submissionsBusiness.HardDeleteArchived(limit);
    }
}