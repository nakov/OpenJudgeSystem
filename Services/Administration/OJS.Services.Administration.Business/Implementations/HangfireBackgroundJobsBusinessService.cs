namespace OJS.Services.Administration.Business.Implementations
{
    using System;
    using System.Threading.Tasks;
    using OJS.Services.Common;

    public class HangfireBackgroundJobsBusinessService : IHangfireBackgroundJobsBusinessService
    {
        private readonly ISubmissionsForProcessingBusinessService submissionsForProcessing;

        public HangfireBackgroundJobsBusinessService(ISubmissionsForProcessingBusinessService submissionsForProcessing)
            => this.submissionsForProcessing = submissionsForProcessing;

        public int EnqueuePendingSubmissions() => this.submissionsForProcessing.EnqueuePendingSubmissions();

        public void DeleteProcessedSubmissions() => this.submissionsForProcessing.DeleteProcessedSubmissions();
    }
}