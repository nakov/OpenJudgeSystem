namespace OJS.Services.Administration.Business.Implementations
{
    using System.Linq;
    using System.Threading.Tasks;
    using OJS.Services.Administration.Data;

    public class SubmissionsForProcessingBusinessService : ISubmissionsForProcessingBusinessService
    {
        private readonly ISubmissionsForProcessingDataService submissionsForProcessingData;

        public SubmissionsForProcessingBusinessService(
            ISubmissionsForProcessingDataService submissionsForProcessingData) =>
            this.submissionsForProcessingData = submissionsForProcessingData;

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
    }
}