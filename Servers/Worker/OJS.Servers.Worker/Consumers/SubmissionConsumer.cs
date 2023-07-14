using MassTransit;
using OJS.Services.Common.Models.PubSubContracts.Submissions;
using OJS.Services.Worker.Business;
using OJS.Services.Worker.Models.ExecutionContext;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System.Threading.Tasks;

namespace OJS.Servers.Worker.Consumers;

public class SubmissionConsumer : IConsumer<SubmissionSubmitted>
{
    private readonly ISubmissionsBusinessService submissionsBusinessService;

    public SubmissionConsumer(
        ISubmissionsBusinessService submissionsBusinessService)
        => this.submissionsBusinessService = submissionsBusinessService;

    public Task Consume(ConsumeContext<SubmissionSubmitted> context)
    {
        var submission = context.Message.Map<SubmissionServiceModel>();

        this.submissionsBusinessService.ExecuteSubmission(submission);

        // TODO: Publish result to the UI server

        return Task.CompletedTask;
    }
}