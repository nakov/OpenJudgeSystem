namespace OJS.Services.Business.SubmissionsDistributor
{
    using OJS.Data.Models;
    using System.Threading.Tasks;
    using OJS.Services.Business.Submissions.Models;
    using OJS.Services.Common.HttpRequester.Models;

    public interface ISubmissionsDistributorCommunicationService
    {
        Task<ExternalDataRetrievalResult<SubmissionAddedToDistributorResponseServiceModel>> AddSubmissionForProcessing(
            Submission submission);

        Task AddAllUnprocessed();
    }
}
