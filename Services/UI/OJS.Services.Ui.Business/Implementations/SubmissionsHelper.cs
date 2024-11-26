namespace OJS.Services.Ui.Business.Implementations;

using System.Threading.Tasks;

public class SubmissionsHelper(ISubmissionsForProcessingBusinessService submissionsForProcessingBusinessService)
    : ISubmissionsHelper
{
    public async Task<bool> IsEligibleForRetest(int submissionId, bool isProcessed, bool isCompiledSuccessfully, int testRunsCount)
        => isProcessed && isCompiledSuccessfully && testRunsCount == 0 &&
           !await submissionsForProcessingBusinessService.IsSubmissionProcessing(submissionId);
}