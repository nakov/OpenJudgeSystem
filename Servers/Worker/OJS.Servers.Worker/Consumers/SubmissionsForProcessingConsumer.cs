namespace OJS.Servers.Worker.Consumers;

using MassTransit;
using Microsoft.Extensions.Logging;
using OJS.Services.Common;
using OJS.Services.Worker.Business;
using OJS.Services.Infrastructure.Extensions;
using System;
using System.Threading.Tasks;
using OJS.PubSub.Worker.Models.Submissions;
using OJS.Services.Common.Models.Submissions;
using OJS.Services.Common.Models.Submissions.ExecutionContext;

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
        this.logger.LogInformation("Received submission #{SubmissionId} for processing",  context.Message.Id);

        var result = new ProcessedSubmissionPubSubModel(context.Message.Id)
        {
            WorkerName = this.hostInfoService.GetHostIp(),
        };

        this.logger.LogInformation("Starting processing submission #{SubmissionId} on worker {WorkerName}", context.Message.Id, result.WorkerName);
        var submission = context.Message.Map<SubmissionServiceModel>();
        var startedExecutionOn = DateTime.UtcNow;

        try
        {
            this.logger.LogInformation("Executing submission #{SubmissionId}: {@Submission}", submission.Id, submission);
            var executionResult = await this.submissionsBusiness.ExecuteSubmission(submission);
            this.logger.LogInformation("Produced execution result for submission #{SubmissionId}: {@ExecutionResult}", submission.Id, executionResult);

            result.SetExecutionResult(executionResult.Map<ExecutionResultServiceModel>());
        }
        catch (Exception ex)
        {
            this.logger.LogError(ex, "Error processing submission #{SubmissionId} on worker: {WorkerName}", submission.Id, result.WorkerName);
            result.SetException(ex, true);
        }
        finally
        {
            result.SetStartedAndCompletedExecutionOn(startedExecutionOn, completedExecutionOn: DateTime.UtcNow);
        }

        this.logger.LogInformation("Publishing processed submission #{SubmissionId} from worker: {WorkerName}", submission.Id, result.WorkerName);
        await this.publisher.Publish(result);
        this.logger.LogInformation("Published processed submission #{SubmissionId} from worker: {WorkerName}", submission.Id, result.WorkerName);
    }
}