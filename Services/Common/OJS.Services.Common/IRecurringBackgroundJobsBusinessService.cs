namespace OJS.Services.Common
{
    using OJS.Services.Common.Filters;
    using OJS.Services.Infrastructure;
    using System.Threading.Tasks;

    public interface IRecurringBackgroundJobsBusinessService : IService
    {
        /// <summary>
        /// Enqueues all submissions that are pending (not added in the message queue, nor processing).
        /// </summary>
        [MessageBusExceptionFilter]
        Task<object> EnqueuePendingSubmissions();

        /// <summary>
        /// Deletes all processed (and not processing) submissions from the SubmissionsForProcessing table.
        /// </summary>
        Task<object> DeleteProcessedSubmissions();

        Task<object> UpdateTotalScoreSnapshotOfParticipants();

        Task<object> RemoveParticipantMultipleScores();
    }
}