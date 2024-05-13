namespace OJS.Servers.Worker.Consumers;

using MassTransit;
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

    public SubmissionsForProcessingConsumer(
        ISubmissionsBusinessService submissionsBusiness,
        IPublisherService publisher)
    {
        this.submissionsBusiness = submissionsBusiness;
        this.publisher = publisher;
    }

    public async Task Consume(ConsumeContext<SubmissionForProcessingPubSubModel> context)
    {
        var message = context.Message;

        var submission = message.Map<SubmissionServiceModel>();

        var result = new ProcessedSubmissionPubSubModel(message.Id);
        var startedExecutionOn = DateTime.UtcNow;

        try
        {
            var executionResult = await this.submissionsBusiness.ExecuteSubmission(submission);

            result.SetExecutionResult(executionResult.Map<ExecutionResultServiceModel>());
        }
        catch (Exception ex)
        {
            result.SetException(ex, true);
        }
        finally
        {
            result.SetStartedAndCompletedExecutionOn(startedExecutionOn, completedExecutionOn: DateTime.UtcNow);
        }

        await this.publisher.Publish(result);
    }
}