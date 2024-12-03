namespace OJS.Servers.Ui.Consumers;

using FluentExtensions.Extensions;
using MassTransit;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using OJS.Common.Enumerations;
using OJS.PubSub.Worker.Models.Submissions;
using OJS.Services.Common.Data;
using OJS.Services.Infrastructure.Constants;
using OJS.Services.Ui.Data;
using System;
using System.Threading.Tasks;

public class ExecutionResultErrorConsumer(
    ILogger<ExecutionResultErrorConsumer> logger,
    ISubmissionsDataService submissionsData,
    ISubmissionsForProcessingCommonDataService submissionsForProcessingData)
    : IConsumer<Fault<ProcessedSubmissionPubSubModel>>
{
    public async Task Consume(ConsumeContext<Fault<ProcessedSubmissionPubSubModel>> context)
    {
        var message = context.Message.Message;
        var submissionId = message.Id;
        logger.LogErrorProcessingExecutionResultForSubmission(
            submissionId,
            context.Message.Message.WorkerName,
            context.Message.Exceptions.ToJson());

        if (message.Exception is not null)
        {
            var workerException = message.Exception?.Message + Environment.NewLine + message.Exception?.StackTrace;
            logger.LogExceptionFromWorker(message.Id, message.WorkerName, workerException);
        }

        var submissionForProcessing = await submissionsForProcessingData
            .GetBySubmission(submissionId);

        if (submissionForProcessing is not null)
        {
            submissionForProcessing.State = SubmissionProcessingState.Faulted;
            submissionsForProcessingData.Update(submissionForProcessing);
        }
        else
        {
            logger.LogSubmissionForProcessingNotFoundForSubmission(null, submissionId);
        }

        var submission = await submissionsData
            .GetByIdQuery(submissionId)
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync();

        if (submission is not null)
        {
            submission.Processed = true;
            submission.IsCompiledSuccessfully = false;
            submission.StartedExecutionOn = message.StartedExecutionOn;
            submission.CompletedExecutionOn = message.CompletedExecutionOn;
            submission.WorkerName = message.WorkerName;
            submission.CompilerComment = "Unexpected error occurred during processing. Please contact support.";
            submission.ProcessingComment = context.Message.Exceptions[0].Message;
            submissionsData.Update(submission);
        }
        else
        {
            logger.LogSubmissionNotFound(submissionId);
        }

        await submissionsData.SaveChanges();
    }
}