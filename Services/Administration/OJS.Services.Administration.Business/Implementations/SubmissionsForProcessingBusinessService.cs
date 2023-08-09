namespace OJS.Services.Administration.Business.Implementations
{
    using System.Linq;
    using System.Threading.Tasks;
    using FluentExtensions.Extensions;
    using Microsoft.EntityFrameworkCore;
    using OJS.Services.Administration.Data;
    using OJS.Services.Common;

    public class SubmissionsForProcessingBusinessService : ISubmissionsForProcessingBusinessService
    {
        private readonly ISubmissionsForProcessingDataService submissionsForProcessingData;
        private readonly ISubmissionsDataService submissionsData;
        private readonly ISubmissionPublisherService submissionPublisherService;

        public SubmissionsForProcessingBusinessService(
            ISubmissionsForProcessingDataService submissionsForProcessingData,
            ISubmissionsDataService submissionsData,
            ISubmissionPublisherService submissionPublisherService)
        {
            this.submissionsForProcessingData = submissionsForProcessingData;
            this.submissionsData = submissionsData;
            this.submissionPublisherService = submissionPublisherService;
        }

        /// <summary>
        /// Sets the Processing property to False for all submissions
        /// thus ensuring that the worker will process them eventually instead
        /// of getting stuck in perpetual "Processing..." state.
        /// </summary>
        public async Task ResetAllProcessingSubmissions()
        {
            var allProcessingSubmissionIds = await this.submissionsForProcessingData.GetIdsOfAllProcessing();

            if (allProcessingSubmissionIds.Count() <= 0)
            {
                return;
            }

            foreach (var submissionForProcessingId in allProcessingSubmissionIds)
            {
                await this.submissionsForProcessingData.ResetProcessingStatusById(submissionForProcessingId);
            }
        }

        public void EnqueueStaleSubmissions()
        {
            var submissionsForProcessing = this.submissionsForProcessingData
                .GetAllUnprocessed()
                .ToListAsync()
                .Result;

            if (!submissionsForProcessing.Any())
            {
                return;
            }

            var submissions = this.submissionsData
                .GetByIds(submissionsForProcessing
                    .Select(sp => sp!.SubmissionId)
                    .ToList())
                .ToListAsync()
                .Result;

            submissions.ForEachSequential(this.submissionPublisherService.Publish);
        }
    }
}