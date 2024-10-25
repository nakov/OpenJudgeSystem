namespace OJS.Services.Ui.Business.Implementations;

using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OJS.Services.Ui.Data;
using OJS.Services.Ui.Models.Submissions;

public class SubmissionsHelper : ISubmissionsHelper
{
    private readonly ISubmissionsForProcessingBusinessService submissionsForProcessingBusinessService;
    private readonly ITestsDataService testsDataService;

    public SubmissionsHelper(
        ISubmissionsForProcessingBusinessService submissionsForProcessingBusinessService,
        ITestsDataService testsDataService)
    {
        this.submissionsForProcessingBusinessService = submissionsForProcessingBusinessService;
        this.testsDataService = testsDataService;
    }
    public async Task<bool> IsEligibleForRetest(SubmissionDetailsServiceModel detailsModel)
        => (detailsModel.Tests.Count != 0 || await this.testsDataService.GetAllByProblem(detailsModel.Problem.Id).AnyAsync()) &&
           !detailsModel.TestRuns.Any() &&
           detailsModel is { IsProcessed: true, IsCompiledSuccessfully: true } &&
           !await this.submissionsForProcessingBusinessService.IsSubmissionProcessing(detailsModel.Id);
}