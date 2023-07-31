namespace OJS.Services.Common.Implementations;

using System.Linq;
using System.Threading.Tasks;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using OJS.PubSub.Worker.Models.Submissions;
using OJS.Data.Models.Submissions;

public class SubmissionPublisherService : ISubmissionPublisherService
{
    private readonly IPublisherService publisher;

    public SubmissionPublisherService(
        IPublisherService publisher)
        => this.publisher = publisher;

    public Task Publish(Submission submission)
    {
        var pubSubModel = submission.Map<SubmissionForProcessingPubSubModel>();

        pubSubModel.TestsExecutionDetails!.TaskSkeleton = submission.Problem!.SubmissionTypesInProblems
            .Where(x => x.SubmissionTypeId == submission.SubmissionTypeId)
            .Select(x => x.SolutionSkeleton)
            .FirstOrDefault();

        return this.publisher.Publish(pubSubModel);
    }
}