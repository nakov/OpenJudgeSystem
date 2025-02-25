namespace OJS.Servers.Administration.Consumers;

using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using OJS.Services.Administration.Models;
using OJS.Services.Infrastructure.HttpClients;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

public class ContestLimitBetweenSubmissionsHostedService(
    IOptions<ApplicationConfig> applicationConfigAccessor,
    IRabbitMqHttpClient rabbitMqClient)
    : IHostedService
{
    private const string WorkersQueueName = "OJS.Servers.Worker.Consumers.SubmissionsForProcessingConsumer";
    private readonly TimeSpan timeBetweenContestLimitsAdjustment =
        TimeSpan.FromSeconds(applicationConfigAccessor.Value.SecondsBetweenContestLimitsAdjustment);

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        while (!cancellationToken.IsCancellationRequested)
        {
            var consumers = await rabbitMqClient.GetConsumers();
            var channels = await rabbitMqClient.GetChannels();
            var queue = await rabbitMqClient.GetQueue(WorkersQueueName);
            var workerConsumers = consumers.Where(c => c is { Active: true, PrefetchCount: 1, Queue.Name: WorkersQueueName }).ToList();
            var workerChannels = channels.Where(ch => workerConsumers.Select(w => w.ChannelDetails.Name).Contains(ch.Name)).ToList();
            var totalWorkers = workerConsumers.Count;
            var busyWorkers = workerChannels.Count(ch => ch.MessagesUnacknowledged > 0);
            await Task.Delay(this.timeBetweenContestLimitsAdjustment, cancellationToken);
        }
    }

    public Task StopAsync(CancellationToken cancellationToken)
        => Task.CompletedTask;
}