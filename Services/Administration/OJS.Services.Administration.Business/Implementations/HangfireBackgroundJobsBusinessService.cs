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

        public async Task ResetAllProcessingSubmissionsJob()
            => await this.submissionsForProcessing.ResetAllProcessingSubmissions();

        public int EnqueuePendingSubmissionsJob() => this.submissionsForProcessing.EnqueuePendingSubmissions();

        public void DeleteProcessedSubmissionsJob() => this.submissionsForProcessing.DeleteProcessedSubmissions();
        public Task<int> GetUnprocessedTotalCountJob() => throw new NotImplementedException();
    }
}