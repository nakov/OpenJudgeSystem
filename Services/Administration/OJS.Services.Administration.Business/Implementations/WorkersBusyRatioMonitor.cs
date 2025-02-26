namespace OJS.Services.Administration.Business.Implementations;

using Microsoft.Extensions.Options;
using OJS.Common.Utils;
using OJS.Services.Administration.Models;
using OJS.Services.Common.Helpers;
using OJS.Services.Infrastructure.HttpClients;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using static OJS.Common.Constants.ServiceConstants;

public class WorkersBusyRatioMonitor(
    IOptions<ApplicationConfig> applicationConfigAccessor,
    IRabbitMqHttpClient rabbitMqClient)
    : IWorkersBusyRatioMonitor
{
    private readonly RollingAverage rollingAverage = new(TimeSpan.FromSeconds(applicationConfigAccessor.Value.SecondsBetweenContestLimitsAdjustment));
    private readonly ExponentialMovingAverage ema = new(applicationConfigAccessor.Value.BusyRatioMonitorAlpha);
    private readonly TimeSpan pollInterval = TimeSpan.FromSeconds(applicationConfigAccessor.Value.SecondsBetweenWorkersBusyRatioPolling);
    private bool running;

    public void StartMonitoring(CancellationToken cancellationToken)
    {
        this.running = true;
        Task.Run(async () =>
        {
            while (this.running)
            {
                var (consumers, channels) = await TasksUtils.WhenAll(
                    rabbitMqClient.GetConsumers(),
                    rabbitMqClient.GetChannels());

                var workerConsumers = consumers
                    .Where(c => c is { Active: true, PrefetchCount: 1, Queue.Name: WorkersQueueName })
                    .ToList();

                var workerChannels = channels
                    .Where(ch => workerConsumers.Select(w => w.ChannelDetails.Name).Contains(ch.Name))
                    .ToList();

                var totalWorkers = workerConsumers.Count;
                var busyWorkers = workerChannels.Count(ch => ch.MessagesUnacknowledged > 0);
                var busyRatio = (double)busyWorkers / totalWorkers;

                this.ema.AddDataPoint(busyRatio);
                this.rollingAverage.AddMeasurement(busyRatio);

                await Task.Delay(this.pollInterval, cancellationToken);
            }
        }, cancellationToken);
    }

    public void StopMonitoring() => this.running = false;

    public (double ema, double rollingAverage) GetWorkersBusyRatio()
        => (this.ema.CurrentValue, this.rollingAverage.GetAverage());
}