namespace OJS.Services.Administration.Business.Implementations
{
    using OJS.Services.Common;
    using System.Threading.Tasks;

    public class RecurringBackgroundJobsBusinessService : IRecurringBackgroundJobsBusinessService
    {
        private readonly ISubmissionsForProcessingBusinessService submissionsForProcessing;
        private readonly IParticipantsBusinessService participantsBusinessService;

        public RecurringBackgroundJobsBusinessService(
            ISubmissionsForProcessingBusinessService submissionsForProcessing,
            IParticipantsBusinessService participantsBusinessService)
        {
            this.submissionsForProcessing = submissionsForProcessing;
            this.participantsBusinessService = participantsBusinessService;
        }

        public async Task<object> EnqueuePendingSubmissions()
        {
            var enqueuedSubmissionsCount = await this.submissionsForProcessing.EnqueuePendingSubmissions();

            return $"Successfully enqueued {enqueuedSubmissionsCount} pending submissions.";
        }

        public async Task<object> DeleteProcessedSubmissions()
        {
            await this.submissionsForProcessing.DeleteProcessedSubmissions();

            return "Successfully deleted all processed submissions from SubmissionsForProcessing table";
        }

        public async Task<object> UpdateTotalScoreSnapshotOfParticipants()
        {
           await this.participantsBusinessService.UpdateTotalScoreSnapshotOfParticipants();

           return "Successfully updated total score snapshot of participants";
        }

        public async Task<object> RemoveParticipantMultipleScores()
        {
            await this.participantsBusinessService.RemoveParticipantMultipleScores();

            return "Successfully removed participant multiple scores";
        }
    }
}