namespace OJS.Servers.Administration.Consumers;

using System.Threading.Tasks;
using MassTransit;
using Microsoft.Extensions.Logging;
using OJS.PubSub.Worker.Models.Submissions;
using OJS.Services.Administration.Business.Submissions;

public class RetestSubmissionConsumer : IConsumer<RetestSubmissionPubSubModel>
{
    private readonly ISubmissionsBusinessService submissionsBusinessService;
    private readonly ILogger<RetestSubmissionConsumer> logger;

    public RetestSubmissionConsumer(
        ISubmissionsBusinessService submissionsBusinessService,
        ILogger<RetestSubmissionConsumer> logger)
    {
        this.submissionsBusinessService = submissionsBusinessService;
        this.logger = logger;
    }

    public async Task Consume(ConsumeContext<RetestSubmissionPubSubModel> context)
    {
        this.logger.LogInformation("Received retest submission #{SubmissionId}", context.Message.Id);
        await this.submissionsBusinessService.Retest(context.Message.Id);
        this.logger.LogInformation("Retested submission #{SubmissionId}", context.Message.Id);
    }
}