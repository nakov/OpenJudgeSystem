namespace OJS.Services.Common.Communication.Implementations
{
    using OJS.Data.Models.Submissions;
    using OJS.Services.Common.Models;
    using OJS.Services.Common.Models.Submissions;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    public class SubmissionsDistributorCommunicationService : ISubmissionsDistributorCommunicationService
    {
        public Task<ExternalDataRetrievalResult<SubmissionAddedToDistributorResponseServiceModel>> AddSubmissionForProcessing(Submission submission) => throw new System.NotImplementedException();

        public Task<ExternalDataRetrievalResult<SubmissionAddedToDistributorResponseServiceModel>> AddSubmissionsForProcessing(IEnumerable<Submission> submissions) => throw new System.NotImplementedException();

        public Task AddAllUnprocessed() => throw new System.NotImplementedException();
    }
}