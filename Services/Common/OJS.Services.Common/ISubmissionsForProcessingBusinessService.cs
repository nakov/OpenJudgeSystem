namespace OJS.Services.Common
{
    using System.Threading.Tasks;

    public interface ISubmissionsForProcessingBusinessService
    {
        Task ResetAllProcessingSubmissions();

        int EnqueuePendingSubmissions();

        void DeleteProcessedSubmissions();

        Task<int> GetUnprocessedTotalCount();
    }
}