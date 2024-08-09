namespace OJS.Servers.Ui.Consumers;

using System.Threading.Tasks;
using MassTransit;
using Microsoft.Extensions.Logging;
using OJS.Services.Infrastructure.Extensions;
using OJS.PubSub.Worker.Models.Submissions;
using OJS.Services.Common.Models.Submissions;
using OJS.Services.Ui.Business;
using System;

public class ExecutionResultConsumer : IConsumer<ProcessedSubmissionPubSubModel>
{
    private readonly ISubmissionsBusinessService submissionsBusinessService;
    private readonly ILogger<ExecutionResultConsumer> logger;

    public ExecutionResultConsumer(
        ISubmissionsBusinessService submissionsBusinessService,
        ILogger<ExecutionResultConsumer> logger)
    {
        this.submissionsBusinessService = submissionsBusinessService;
        this.logger = logger;
    }

    public async Task Consume(ConsumeContext<ProcessedSubmissionPubSubModel> context)
    {
        var workerName = context.Message.WorkerName + $" ({context.Host.MachineName})";

        this.logger.LogInformation("Received execution result for submission #{SubmissionId} from worker {WorkerName}", context.Message.Id, workerName);

        if (context.Message.Exception != null)
        {
            this.logger.LogError("Exception returned for submission #{SubmissionId}: {@SubmissionException}", context.Message.Id, context.Message.Exception);
        }

        try
        {
            var executionResult = context.Message.Map<SubmissionExecutionResult>();
            this.logger.LogInformation("Starting processing execution result for submission #{SubmissionId}: {@ExecutionResult}", context.Message.Id, executionResult);
            executionResult.WorkerName = workerName;
            await this.submissionsBusinessService.ProcessExecutionResult(executionResult);
            this.logger.LogInformation("Processed execution result for submission #{SubmissionId} from worker {WorkerName}", executionResult.SubmissionId, executionResult.WorkerName);
        }
        catch (Exception ex)
        {
            this.logger.LogError(ex, "Error processing execution result for submission #{SubmissionId} from worker {WorkerName}", context.Message.Id, workerName);
            throw;
        }
    }
}