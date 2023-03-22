﻿namespace OJS.Services.Business.Submissions.ArchivedSubmissions
{
    using Hangfire;
    using Hangfire.Server;

    using OJS.Services.Common;

    public interface IArchivedSubmissionsBusinessService : IService
    {
        [AutomaticRetry(Attempts = 0)]
        int ArchiveOldSubmissionsDailyBatch(PerformContext context, int limit);

        int ArchiveOldSubmissionsWithLimit(PerformContext context, int limit);

        void ArchiveOldSubmissions(PerformContext context);

        void HardDeleteCurrentArchived(PerformContext context);

        int HardDeleteArchivedByLimit(PerformContext context, int limit);
    }
}