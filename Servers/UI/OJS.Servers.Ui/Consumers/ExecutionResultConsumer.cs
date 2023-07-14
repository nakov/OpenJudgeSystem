using MassTransit;
using OJS.Services.Common.Models.PubSubContracts.ExecutionResult;
using OJS.Services.Ui.Business;
using OJS.Services.Ui.Models.Submissions;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System.Threading.Tasks;

namespace OJS.Servers.Ui.Consumers;

public class ExecutionResultConsumer : IConsumer<SubmissionProcessed>
{
    private readonly ISubmissionsBusinessService submissionsBusinessService;

    public ExecutionResultConsumer(ISubmissionsBusinessService submissionsBusinessService)
        => this.submissionsBusinessService = submissionsBusinessService;

    public async Task Consume(ConsumeContext<SubmissionProcessed> context)
    {
        var executionResult = context.Message.Map<SubmissionExecutionResult>();

        await this.submissionsBusinessService.ProcessExecutionResult(executionResult);
    }
}