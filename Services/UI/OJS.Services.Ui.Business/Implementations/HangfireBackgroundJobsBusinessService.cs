namespace OJS.Services.Ui.Business.Implementations;

using OJS.Services.Common;

public class HangfireBackgroundJobsBusinessService : IHangfireBackgroundJobsBusinessService
{
    public HangfireBackgroundJobsBusinessService()
    {
    }

    public int EnqueuePendingSubmissions() => throw new System.NotImplementedException();

    public void DeleteProcessedSubmissions() => throw new System.NotImplementedException();
}