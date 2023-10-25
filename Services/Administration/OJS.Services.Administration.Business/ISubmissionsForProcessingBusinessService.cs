namespace OJS.Services.Administration.Business;

using System.Threading.Tasks;
using SoftUni.Services.Infrastructure;

public interface ISubmissionsForProcessingBusinessService : IService
{
    /// <summary>
    /// Enqueues all submissions that are pending (not added in the queue, nor processing).
    /// </summary>
    /// <returns>The count of submissions enqueued.</returns>
    Task<int> EnqueuePendingSubmissions();

    /// <summary>
    /// Deletes all processed (and not processing) submissions from the SubmissionsForProcessing table.
    /// </summary>
    Task DeleteProcessedSubmissions();
}