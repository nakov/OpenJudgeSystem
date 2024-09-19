namespace OJS.Services.Administration.Business.SubmissionsForProcessing;

using System.Threading.Tasks;
using OJS.Data.Models.Submissions;
using OJS.Services.Administration.Models.SubmissionsForProcessing;

public interface ISubmissionsForProcessingBusinessService : IAdministrationOperationService<
    SubmissionForProcessing,
    int,
    SubmissionsForProcessingAdministrationServiceModel>
{
    /// <summary>
    /// Enqueues all submissions that are pending (not added in the queue, nor processing).
    /// </summary>
    /// <returns>The count of submissions enqueued.</returns>
    Task<int> EnqueuePendingSubmissions(int fromMinutesAgo);

    /// <summary>
    /// Deletes all processed (and not processing) submissions from the SubmissionsForProcessing table.
    /// </summary>
    Task<int> DeleteProcessedSubmissions(int fromMinutesAgo);
}