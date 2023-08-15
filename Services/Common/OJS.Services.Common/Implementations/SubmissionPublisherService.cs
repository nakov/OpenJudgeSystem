namespace OJS.Services.Common.Implementations;

using System.Threading.Tasks;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using OJS.Services.Common.Models.Submissions.ExecutionContext;
using OJS.PubSub.Worker.Models.Submissions;

public class SubmissionPublisherService : ISubmissionPublisherService
{
    private readonly IPublisherService publisher;

    public SubmissionPublisherService(
        IPublisherService publisher)
        => this.publisher = publisher;

    public Task Publish(SubmissionServiceModel submission)
    {
        var pubSubModel = submission.Map<SubmissionForProcessingPubSubModel>();

        return this.publisher.Publish(pubSubModel);
    }
}