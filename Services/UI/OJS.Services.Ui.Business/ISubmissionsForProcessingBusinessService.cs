namespace OJS.Services.Ui.Business;

using System.Threading.Tasks;
using OJS.Services.Infrastructure;

public interface ISubmissionsForProcessingBusinessService : IService
{
    Task<bool> IsSubmissionProcessing(int submissionId);
}