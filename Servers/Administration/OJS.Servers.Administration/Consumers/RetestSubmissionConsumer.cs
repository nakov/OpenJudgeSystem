namespace OJS.Servers.Administration.Consumers;

using System.Threading.Tasks;
using MassTransit;
using OJS.PubSub.Worker.Models.Submissions;
using OJS.Services.Administration.Business;

public class RetestSubmissionConsumer : IConsumer<RetestSubmissionPubSubModel>
{
    private readonly ISubmissionsBusinessService submissionsBusinessService;

    public RetestSubmissionConsumer(ISubmissionsBusinessService submissionsBusinessService)
        => this.submissionsBusinessService = submissionsBusinessService;

    public Task Consume(ConsumeContext<RetestSubmissionPubSubModel> context)
        => this.submissionsBusinessService.Retest(context.Message.Id);
}