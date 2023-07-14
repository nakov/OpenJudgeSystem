using MassTransit;
using OJS.PubSubContracts.ExecutionResults;
using OJS.Services.Ui.Business;
using OJS.Services.Ui.Models.Submissions;
using SoftUni.AutoMapper.Infrastructure.Extensions;

namespace OJS.Servers.Ui.Infrastructure.Consumers;

public class ExecutionResultConsumer : IConsumer<FullExecutionResult>
{
    private readonly ISubmissionsBusinessService submissionsBusinessService;

    public ExecutionResultConsumer(ISubmissionsBusinessService submissionsBusinessService)
        => this.submissionsBusinessService = submissionsBusinessService;

    public async Task Consume(ConsumeContext<FullExecutionResult> context)
    {
        var executionResult = context.Message.Map<SubmissionExecutionResult>();

        await this.submissionsBusinessService.ProcessExecutionResult(executionResult);
    }
}