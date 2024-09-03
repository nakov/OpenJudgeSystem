namespace OJS.Servers.Worker.Consumers;

using MassTransit;
using Microsoft.Extensions.Logging;
using OJS.Services.Common;
using OJS.Services.Worker.Business;
using OJS.Services.Infrastructure.Extensions;
using System;
using System.Threading.Tasks;
using OJS.PubSub.Worker.Models.Submissions;
using OJS.Services.Common.Extensions;
using OJS.Services.Common.Models.Submissions;
using OJS.Services.Common.Models.Submissions.ExecutionContext;
using OJS.Services.Infrastructure.Constants;

public class SubmissionsForProcessingConsumer : IConsumer<SubmissionForProcessingPubSubModel>
{
    private readonly ISubmissionsBusinessService submissionsBusiness;
    private readonly IPublisherService publisher;
    private readonly IHostInfoService hostInfoService;
    private readonly ILogger<SubmissionsForProcessingConsumer> logger;

    public SubmissionsForProcessingConsumer(
        ISubmissionsBusinessService submissionsBusiness,
        IPublisherService publisher,
        IHostInfoService hostInfoService,
        ILogger<SubmissionsForProcessingConsumer> logger)
    {
        this.submissionsBusiness = submissionsBusiness;
        this.publisher = publisher;
        this.hostInfoService = hostInfoService;
        this.logger = logger;
    }

    public async Task Consume(ConsumeContext<SubmissionForProcessingPubSubModel> context)
    {
        this.logger.LogReceivedSubmissionForProcessing(context.Message.Id);

        var result = new ProcessedSubmissionPubSubModel(context.Message.Id)
        {
            WorkerName = this.hostInfoService.GetHostIp(),
        };

        this.logger.LogStartingProcessingSubmission(context.Message.Id, result.WorkerName);
        var submission = context.Message.Map<SubmissionServiceModel>();
        var startedExecutionOn = DateTime.UtcNow;

        try
        {
            this.logger.LogExecutingSubmission(submission.Id, submission.TrimDetails());
            var executionResult = await this.submissionsBusiness.ExecuteSubmission(submission);
            this.logger.LogProducedExecutionResult(submission.Id, executionResult);

            result.SetExecutionResult(executionResult.Map<ExecutionResultServiceModel>());
        }
        catch (Exception ex)
        {
            this.logger.LogErrorProcessingSubmission(submission.Id, result.WorkerName, ex);
            result.SetException(ex, true);
        }
        finally
        {
            result.SetStartedAndCompletedExecutionOn(startedExecutionOn, completedExecutionOn: DateTime.UtcNow);
        }

        this.logger.LogPublishingProcessedSubmission(submission.Id, result.WorkerName);
        await this.publisher.Publish(result);
        this.logger.LogPublishedProcessedSubmission(submission.Id, result.WorkerName);
    }
}