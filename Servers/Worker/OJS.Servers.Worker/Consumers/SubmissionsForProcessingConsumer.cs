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
        var message = context.Message;
        var result = new ProcessedSubmissionPubSubModel(message.Id)
        {
            WorkerName = this.hostInfoService.GetHostIp(),
        };

        this.logger.LogInformation("Starting processing submission with id: {SubmissionId} on worker: {WorkerName}", message.Id, result.WorkerName);
        var submission = message.Map<SubmissionServiceModel>();
        var startedExecutionOn = DateTime.UtcNow;

        try
        {
            this.logger.LogInformation("Executing submission with id: {SubmissionId}", submission.Id);
            var executionResult = await this.submissionsBusiness.ExecuteSubmission(submission);
            this.logger.LogDebug("Execution result for submission with id: {SubmissionId}: {@ExecutionResult}", submission.Id, executionResult);

            this.logger.LogInformation("Mapping execution result for submission with id: {SubmissionId}", submission.Id);
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