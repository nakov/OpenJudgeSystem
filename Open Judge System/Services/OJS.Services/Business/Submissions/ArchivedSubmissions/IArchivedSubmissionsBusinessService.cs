namespace OJS.Services.Business.Submissions.ArchivedSubmissions
{
    using Hangfire.Server;

    using OJS.Services.Common;

    public interface IArchivedSubmissionsBusinessService : IService
    {
        void ArchiveOldSubmissionsWithLimit(PerformContext context, int limit);

        void ArchiveOldSubmissions(PerformContext context);

        void HardDeleteCurrentArchived(PerformContext context);

        void HardDeleteArchivedByLimit(PerformContext context, int limit);
    }
}