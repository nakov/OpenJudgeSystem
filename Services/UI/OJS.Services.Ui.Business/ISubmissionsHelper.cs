namespace OJS.Services.Ui.Business;

using System.Threading.Tasks;
using OJS.Services.Infrastructure;

public interface ISubmissionsHelper : IService
{
    Task<bool> IsEligibleForRetest(int submissionId, bool isProcessed, bool isCompiledSuccessfully, int testRunsCount);
}