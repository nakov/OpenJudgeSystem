namespace OJS.Services.Ui.Business.Implementations;

using System.Linq;
using System.Threading.Tasks;
using OJS.Services.Ui.Models.Submissions;

public class SubmissionsHelper : ISubmissionsHelper
{
    private readonly ISubmissionsForProcessingBusinessService submissionsForProcessingBusinessService;

    public SubmissionsHelper(ISubmissionsForProcessingBusinessService submissionsForProcessingBusinessService)
        => this.submissionsForProcessingBusinessService = submissionsForProcessingBusinessService;
    public async Task<bool> IsEligibleForRetest(SubmissionDetailsServiceModel detailsModel)
        => detailsModel.Tests.Count != 0 && !detailsModel.TestRuns.Any() &&
           detailsModel is { IsProcessed: true, IsCompiledSuccessfully: true } &&
           !await this.submissionsForProcessingBusinessService.IsSubmissionProcessing(detailsModel.Id);
}