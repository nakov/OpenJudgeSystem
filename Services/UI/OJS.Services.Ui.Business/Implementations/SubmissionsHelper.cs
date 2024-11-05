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
        => detailsModel is { IsProcessed: true, IsCompiledSuccessfully: true, TestRuns.Count: 0 } &&
           (detailsModel.Tests.Count != 0 ||
            // Since the tests are no longer fetched with the submission itself, but with the test runs, if there are no test runs, no tests will be fetched (even if they exist).
            // This is why a separate query must be made to the database, when the Tests' count is 0, this may not seem optimal,
            // but the amount of times a user will be retesting a submission is far less often than the amount of times they will be checking their submission's details
            // when the test runs exist (the submission is not eligible for a retest).
            await this.testsDataService.GetAllByProblem(detailsModel.Problem.Id).AnyAsync()) &&
           !await this.submissionsForProcessingBusinessService.IsSubmissionProcessing(detailsModel.Id);
}