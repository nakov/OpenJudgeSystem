namespace OJS.Servers.Ui.Consumers;

using System.Threading.Tasks;
using MassTransit;
using OJS.Services.Infrastructure.Extensions;
using OJS.PubSub.Worker.Models.Submissions;
using OJS.Services.Common.Models.Submissions;
using OJS.Services.Ui.Business;

public class ExecutionResultConsumer : IConsumer<ProcessedSubmissionPubSubModel>
{
    private readonly ISubmissionsBusinessService submissionsBusinessService;

    public ExecutionResultConsumer(ISubmissionsBusinessService submissionsBusinessService)
        => this.submissionsBusinessService = submissionsBusinessService;

    public async Task Consume(ConsumeContext<ProcessedSubmissionPubSubModel> context)
    {
        var executionResult = context.Message.Map<SubmissionExecutionResult>();

        await this.submissionsBusinessService.ProcessExecutionResult(executionResult);
    }
}