namespace OJS.Servers.Administration.Consumers;

using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Models;
using OJS.Services.Infrastructure.HttpClients;
using System;
using System.Threading;
using System.Threading.Tasks;
using static OJS.Common.Constants.ServiceConstants;

public class ContestLimitBetweenSubmissionsHostedService(
    IOptions<ApplicationConfig> applicationConfigAccessor,
    IRabbitMqHttpClient rabbitMqClient,
    IWorkersBusyRatioMonitor workersBusyRatioMonitor)
    : IHostedService
{
    private readonly TimeSpan timeBetweenContestLimitsAdjustment =
        TimeSpan.FromSeconds(applicationConfigAccessor.Value.SecondsBetweenContestLimitsAdjustment);

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        workersBusyRatioMonitor.StartMonitoring(cancellationToken);

        while (!cancellationToken.IsCancellationRequested)
        {
            var queue = await rabbitMqClient.GetQueue(WorkersQueueName);
            var (busyRatioEma, busyRatioRollingAverage) = workersBusyRatioMonitor.GetWorkersBusyRatio();
            var messagesAwaitingExecution = queue?.MessagesReady ?? 0;
            await Task.Delay(this.timeBetweenContestLimitsAdjustment, cancellationToken);
        }
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        workersBusyRatioMonitor.StopMonitoring();
        return Task.CompletedTask;
    }
}