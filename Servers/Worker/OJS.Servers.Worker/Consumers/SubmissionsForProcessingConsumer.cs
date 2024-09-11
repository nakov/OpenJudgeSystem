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
        var workerName = this.hostInfoService.GetHostIp();
        this.logger.LogStartingProcessingSubmission(context.Message.Id, workerName);

        var startedExecutionOn = DateTimeOffset.UtcNow;
        var submissionStartedProcessingPubSubModel = new SubmissionStartedProcessingPubSubModel
        {
            SubmissionId = context.Message.Id,
            ProcessingStartedAt = startedExecutionOn,
        };

        var result = new ProcessedSubmissionPubSubModel(context.Message.Id)
        {
            WorkerName = workerName,
        };

        await this.publisher.Publish(submissionStartedProcessingPubSubModel);

        try
        {
            var submission = context.Message.Map<SubmissionServiceModel>();
            this.logger.LogExecutingSubmission(submission.Id, submission.TrimDetails());
            var executionResult = await this.submissionsBusiness.ExecuteSubmission(submission);
            this.logger.LogProducedExecutionResult(submission.Id, executionResult);

            result.SetExecutionResult(executionResult.Map<ExecutionResultServiceModel>());
        }
        catch (Exception ex)
        {
            this.logger.LogErrorProcessingSubmission(context.Message.Id, result.WorkerName, ex);
            result.SetException(ex, true);
        }
        finally
        {
            result.SetStartedAndCompletedExecutionOn(startedExecutionOn.UtcDateTime, completedExecutionOn: DateTime.UtcNow);
        }

        await this.publisher.Publish(result);
        this.logger.LogPublishedProcessedSubmission(context.Message.Id, result.WorkerName);
    }
}