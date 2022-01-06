namespace OJS.Services.Common
{
    using OJS.Data.Models.Submissions;
    using OJS.Services.Common.Models;
    using OJS.Services.Common.Models.Submissions;
    using SoftUni.Services.Infrastructure;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    public interface ISubmissionsDistributorCommunicationService : IService
    {
        Task<ExternalDataRetrievalResult<SubmissionAddedToDistributorResponseServiceModel>> AddSubmissionForProcessing(
            Submission submission);

        Task<ExternalDataRetrievalResult<SubmissionAddedToDistributorResponseServiceModel>> AddSubmissionsForProcessing(
            IEnumerable<Submission> submissions);

        Task AddAllUnprocessed();
    }
}