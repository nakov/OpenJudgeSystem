namespace OJS.Services.Common
{
    using System.Threading.Tasks;

    public interface IHangfireBackgroundJobsBusinessService
    {
        Task ResetAllProcessingSubmissionsJob();

        int EnqueuePendingSubmissionsJob();

        void DeleteProcessedSubmissionsJob();

        Task<int> GetUnprocessedTotalCountJob();
    }
}