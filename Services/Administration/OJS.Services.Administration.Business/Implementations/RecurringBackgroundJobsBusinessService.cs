namespace OJS.Services.Administration.Business.Implementations
{
    using OJS.Services.Common;
    using System.Threading.Tasks;

    public class RecurringBackgroundJobsBusinessService : IRecurringBackgroundJobsBusinessService
    {
        private readonly ISubmissionsForProcessingBusinessService submissionsForProcessing;

        public RecurringBackgroundJobsBusinessService(ISubmissionsForProcessingBusinessService submissionsForProcessing)
            => this.submissionsForProcessing = submissionsForProcessing;

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
    }
}