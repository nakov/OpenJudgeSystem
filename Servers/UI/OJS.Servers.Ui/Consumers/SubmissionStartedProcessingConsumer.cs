namespace OJS.Servers.Ui.Consumers;

using MassTransit;
using Microsoft.Extensions.Logging;
using OJS.Common.Enumerations;
using OJS.PubSub.Worker.Models.Submissions;
using OJS.Services.Common.Data;
using OJS.Services.Infrastructure.Constants;
using System.Threading.Tasks;

public class SubmissionStartedProcessingConsumer(
    ISubmissionsForProcessingCommonDataService submissionsForProcessingCommonData,
    ILogger<SubmissionStartedProcessingConsumer> logger)
    : IConsumer<SubmissionStartedProcessingPubSubModel>
{
    public async Task Consume(ConsumeContext<SubmissionStartedProcessingPubSubModel> context)
    {
        var submissionId = context.Message.SubmissionId;

        var submissionForProcessing = await submissionsForProcessingCommonData.GetBySubmission(submissionId);

        if (submissionForProcessing == null)
        {
            logger.LogSubmissionForProcessingNotFoundForSubmission(0, submissionId);
        }
        else if (submissionForProcessing.State == SubmissionProcessingState.Processed)
        {
            // We have already processed this submission, so no need to mark it as processing.
            logger.LogSubmissionAlreadyProcessed(submissionId);
        }
        else
        {
            await submissionsForProcessingCommonData.MarkProcessing(
                submissionForProcessing,
                context.Message.ProcessingStartedAt);
        }
    }
}