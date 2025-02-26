namespace OJS.Services.Administration.Business;

using OJS.Services.Infrastructure;
using System.Threading;

public interface IWorkersBusyRatioMonitor : ISingletonService
{
    void StartMonitoring(CancellationToken cancellationToken);

    void StopMonitoring();

    (double ema, double rollingAverage) GetWorkersBusyRatio();
}