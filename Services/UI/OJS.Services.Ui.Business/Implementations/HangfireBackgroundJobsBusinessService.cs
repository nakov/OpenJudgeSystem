namespace OJS.Services.Ui.Business.Implementations;

using OJS.Services.Common;

public class HangfireBackgroundJobsBusinessService : IHangfireBackgroundJobsBusinessService
{
    public HangfireBackgroundJobsBusinessService()
    {
    }

    // Method is executed by administration implementation
    public int EnqueuePendingSubmissions() => throw new System.NotImplementedException();

    // Method is executed by administration implementation
    public void DeleteProcessedSubmissions() => throw new System.NotImplementedException();
}