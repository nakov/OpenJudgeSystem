namespace OJS.Servers.Ui.Consumers;

using System.Threading.Tasks;
using MassTransit;
using Microsoft.Extensions.Logging;
using OJS.Services.Infrastructure.Extensions;
using OJS.PubSub.Worker.Models.Submissions;
using OJS.Services.Common.Models.Submissions;
using OJS.Services.Infrastructure.Constants;
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

        this.logger.LogReceivedExecutionResult(context.Message.Id, workerName);

        if (context.Message.Exception != null)
        {
            this.logger.LogExceptionReturnedForSubmission(context.Message.Id, context.Message.Exception);
        }

        try
        {
            var executionResult = context.Message.Map<SubmissionExecutionResult>();
            this.logger.LogStartingProcessingExecutionResult(executionResult.SubmissionId, executionResult);
            executionResult.WorkerName = workerName;
            await this.submissionsBusinessService.ProcessExecutionResult(executionResult);
            this.logger.LogProcessedExecutionResult(executionResult.SubmissionId, workerName);
        }
        catch (Exception ex)
        {
            this.logger.LogErrorProcessingExecutionResult(context.Message.Id, workerName, ex);
            throw;
        }
    }
}