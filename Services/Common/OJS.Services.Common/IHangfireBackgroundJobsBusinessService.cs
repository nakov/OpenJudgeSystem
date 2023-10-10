namespace OJS.Services.Common
{
    using System.Threading.Tasks;
    using SoftUni.Services.Infrastructure;

    public interface IHangfireBackgroundJobsBusinessService : IService
    {
        Task ResetAllProcessingSubmissionsJob();

        int EnqueuePendingSubmissionsJob();

        void DeleteProcessedSubmissionsJob();

        Task<int> GetUnprocessedTotalCountJob();
    }
}