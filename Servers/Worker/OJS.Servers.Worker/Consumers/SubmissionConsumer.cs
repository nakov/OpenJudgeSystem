using MassTransit;
using OJS.Services.Common;
using OJS.Services.Common.Models.PubSubContracts.ExecutionResult;
using OJS.Services.Common.Models.PubSubContracts.Submissions;
using OJS.Services.Worker.Business;
using OJS.Services.Worker.Models.ExecutionContext;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System;
using System.Threading.Tasks;
using ExecutionResult = OJS.Services.Common.Models.PubSubContracts.ExecutionResult.ExecutionResult;

namespace OJS.Servers.Worker.Consumers;

public class SubmissionConsumer : IConsumer<SubmissionSubmitted>
{
    private readonly ISubmissionsBusinessService submissionsBusiness;
    private readonly IPublisherService publisher;

    public SubmissionConsumer(
        ISubmissionsBusinessService submissionsBusiness,
        IPublisherService publisher)
    {
        this.submissionsBusiness = submissionsBusiness;
        this.publisher = publisher;
    }

    public Task Consume(ConsumeContext<SubmissionSubmitted> context)
    {
        var message = context.Message;
        var submission = message.Map<SubmissionServiceModel>();

        var result = new SubmissionProcessed(message.Id);

        try
        {
            var executionResult = this.submissionsBusiness.ExecuteSubmission(submission);

            result.SetExecutionResult(executionResult.Map<ExecutionResult>());
        }
        catch (Exception ex)
        {
            result.SetException(ex, true);
        }

        return this.publisher.Publish(result);
    }
}