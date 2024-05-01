namespace OJS.Services.Common.Implementations;

using OJS.Services.Common.Models.Submissions.ExecutionContext;
using System.Collections.Generic;
using System.Threading.Tasks;
using OJS.Services.Infrastructure.Extensions;
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

    public Task PublishRetest(int id)
    {
        var pubSubModel = new RetestSubmissionPubSubModel { Id = id };

        return this.publisher.Publish(pubSubModel);
    }

    public Task PublishMultiple(IEnumerable<SubmissionServiceModel> submissions)
    {
        var pubSubModels = submissions.MapCollection<SubmissionForProcessingPubSubModel>();

        return this.publisher.PublishBatch(pubSubModels);
    }
}