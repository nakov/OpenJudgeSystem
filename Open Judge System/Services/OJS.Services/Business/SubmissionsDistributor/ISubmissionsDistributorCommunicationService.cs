namespace OJS.Services.Business.SubmissionsDistributor
{
    using OJS.Services.Common;
    using OJS.Data.Models;
    using System.Threading.Tasks;

    public interface ISubmissionsDistributorCommunicationService : IService
    {
        Task AddSubmissionForProcessing(Submission submission);
    }
}
