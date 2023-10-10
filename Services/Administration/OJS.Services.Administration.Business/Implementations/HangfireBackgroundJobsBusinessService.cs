﻿namespace OJS.Services.Administration.Business.Implementations
{
    using System;
    using System.Threading.Tasks;
    using OJS.Services.Common;

    public class HangfireBackgroundJobsBusinessService : IHangfireBackgroundJobsBusinessService
    {
        private readonly ISubmissionsForProcessingBusinessService submissionsForProcessing;

        public HangfireBackgroundJobsBusinessService(ISubmissionsForProcessingBusinessService submissionsForProcessing)
            => this.submissionsForProcessing = submissionsForProcessing;

        public int EnqueuePendingSubmissionsJob() => this.submissionsForProcessing.EnqueuePendingSubmissions();

        public void DeleteProcessedSubmissionsJob() => throw new NotImplementedException();

        public Task<int> GetUnprocessedTotalCountJob() => throw new NotImplementedException();
    }
}