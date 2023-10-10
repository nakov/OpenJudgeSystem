namespace OJS.Services.Common
{
    using SoftUni.Services.Infrastructure;

    public interface IHangfireBackgroundJobsBusinessService : IService
    {
        int EnqueuePendingSubmissionsJob();

        void DeleteProcessedSubmissionsJob();
    }
}