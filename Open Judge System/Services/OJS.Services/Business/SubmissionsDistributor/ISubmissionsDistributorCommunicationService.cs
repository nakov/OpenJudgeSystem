namespace OJS.Services.Business.SubmissionsDistributor
{
    using OJS.Data.Models;
    using System.Threading.Tasks;
    using OJS.Services.Business.Submissions.Models;
    using OJS.Services.Common.HttpRequester.Models;
    using System.Collections.Generic;

    public interface ISubmissionsDistributorCommunicationService
    {
        Task<ExternalDataRetrievalResult<SubmissionAddedToDistributorResponseServiceModel>> AddSubmissionForProcessing(
            Submission submission);

        Task<ExternalDataRetrievalResult<SubmissionAddedToDistributorResponseServiceModel>> AddSubmissionsForProcessing(
            IEnumerable<Submission> submissions);

        Task AddAllUnprocessed();
    }
}
