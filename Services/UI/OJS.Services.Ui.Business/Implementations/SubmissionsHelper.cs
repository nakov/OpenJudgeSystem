namespace OJS.Services.Ui.Business.Implementations;

using System.Threading.Tasks;
using OJS.Services.Ui.Models.Submissions;

public class SubmissionsHelper(ISubmissionsForProcessingBusinessService submissionsForProcessingBusinessService)
    : ISubmissionsHelper
{
    public async Task<bool> IsEligibleForRetest(SubmissionDetailsServiceModel detailsModel)
        => detailsModel is { IsProcessed: true, IsCompiledSuccessfully: true, TestRuns.Count: 0, Tests.Count: > 0 } &&
           !await submissionsForProcessingBusinessService.IsSubmissionProcessing(detailsModel.Id);
}