namespace OJS.Services.Ui.Business
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using OJS.Services.Common.Models.Submissions;
    using SoftUni.Services.Infrastructure;

    public interface ISubmissionsForProcessingBusinessService : IService
    {
        Task ResetAllProcessingSubmissions();

        Task<int> GetUnprocessedTotalCount();

        Task<IEnumerable<SubmissionForProcessingServiceModel>> GetAllStale();
    }
}