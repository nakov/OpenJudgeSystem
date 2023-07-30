using MassTransit;
using OJS.PubSub.Worker.Models.Submissions;
using OJS.Services.Common.Models.Submissions;
using OJS.Services.Ui.Business;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System.Threading.Tasks;

namespace OJS.Servers.Ui.Consumers;

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