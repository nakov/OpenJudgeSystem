namespace OJS.Services.Ui.Business;

using System.Threading.Tasks;
using OJS.Services.Infrastructure;

public interface ISubmissionsForProcessingBusinessService : IService
{
    Task<int> GetUnprocessedTotalCount();
    bool IsSubmissionProcessing(int submissionId);
}