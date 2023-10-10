namespace OJS.Services.Ui.Business.Implementations;

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

    public Task<int> GetUnprocessedTotalCountJob()
        => this.submissionsForProcessingData.GetAllUnprocessedCount();

    public int EnqueuePendingSubmissionsJob() => throw new System.NotImplementedException();

    public void DeleteProcessedSubmissionsJob() => throw new System.NotImplementedException();
}