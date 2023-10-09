namespace OJS.Services.Ui.Business.Implementations;

using System.Linq;
using OJS.Services.Common.Data;
using System.Threading.Tasks;
using OJS.Services.Common;

public class HangfireBackgroundJobsBusinessService : IHangfireBackgroundJobsBusinessService
{
    private readonly ISubmissionsForProcessingCommonDataService submissionsForProcessingData;
    private readonly IUserProviderService userProviderService;

    public HangfireBackgroundJobsBusinessService(
        ISubmissionsForProcessingCommonDataService submissionsForProcessingData,
        IUserProviderService userProviderService)
    {
        this.submissionsForProcessingData = submissionsForProcessingData;
        this.userProviderService = userProviderService;
    }

    /// <summary>
    /// Sets the Processing property to False for all submissions
    /// thus ensuring that the worker will process them eventually instead
    /// of getting stuck in perpetual "Processing..." state.
    /// </summary>
    public async Task ResetAllProcessingSubmissionsJob()
    {
        var allProcessingSubmissionIds = await this.submissionsForProcessingData.GetIdsOfAllProcessing();

        if (allProcessingSubmissionIds.Count() <= 0)
        {
            return;
        }

        foreach (var submissionForProcessingId in allProcessingSubmissionIds)
        {
            await this.submissionsForProcessingData.ResetProcessingStatusById(submissionForProcessingId);
        }
    }

    public int EnqueuePendingSubmissionsJob() => throw new System.NotImplementedException();
    public void DeleteProcessedSubmissionsJob() => throw new System.NotImplementedException();

    public Task<int> GetUnprocessedTotalCountJob()
        => this.submissionsForProcessingData.GetAllUnprocessedCount();
}