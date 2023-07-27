using OJS.Services.Common.Models.Submissions;
using OJS.Services.Common.Models.Submissions.ExecutionContext;
using System.Linq;

namespace OJS.Servers.Worker.Consumers;

using MassTransit;
using OJS.PubSub.Worker.Submissions;
using OJS.Services.Common;
using OJS.Services.Worker.Business;
using OJS.Services.Worker.Models.ExecutionContext;
using OJS.Workers.SubmissionProcessors.Models;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System;
using System.Threading.Tasks;

public class SubmissionsForProcessingConsumer : IConsumer<SubmissionForProcessingPubSubModel>
{
    private readonly ISubmissionsBusinessService submissionsBusiness;
    private readonly IPublisherService publisher;

    public SubmissionsForProcessingConsumer(
        ISubmissionsBusinessService submissionsBusiness,
        IPublisherService publisher)
    {
        this.submissionsBusiness = submissionsBusiness;
        this.publisher = publisher;
    }

    public Task Consume(ConsumeContext<SubmissionForProcessingPubSubModel> context)
    {
        var message = context.Message;

        // AutoMapper.AutoMapperMappingException: Missing type map configuration or unsupported mapping.
        // Mapping types:
        // Object -> SubmissionServiceModel
        // TODO: Fix this to use automapper properly
        // var submission = message.Map<SubmissionServiceModel>();

        var submission = new SubmissionServiceModel
        {
            Id = message.Id,
            ExecutionType = message.ExecutionType,
            ExecutionStrategy = message.ExecutionStrategy,
            Code = message.Code,
            FileContent = message.FileContent,
            MemoryLimit = message.MemoryLimit,
            TimeLimit = message.TimeLimit,
            SimpleExecutionDetails = message.SimpleExecutionDetails,
            TestsExecutionDetails = message.TestsExecutionDetails,
            StartedExecutionOn = message.StartedExecutionOn,
        };

        var result = new ProcessedSubmissionPubSubModel(message.Id);
        result.Id = message.Id;

        try
        {
            var executionResult = this.submissionsBusiness.ExecuteSubmission(submission);

            // TODO: Fix this to use Automapper
            result.ExecutionResult = new ExecutionResultServiceModel
            {
                Id = executionResult.Id!,
                IsCompiledSuccessfully = executionResult.IsCompiledSuccessfully,
                StartedExecutionOn = executionResult.StartedExecutionOn,
            };

            if (executionResult.CompilerComment != null)
            {
                result.ExecutionResult.CompilerComment = executionResult.CompilerComment;
            }

            if (executionResult.OutputResult != null)
            {
                result.ExecutionResult.OutputResult = new OutputResultServiceModel
                {
                    Output = executionResult.OutputResult!.Output,
                    MemoryUsedInBytes = executionResult.OutputResult.MemoryUsed,
                    ResultType = executionResult.OutputResult.ResultType.ToString(),
                    TimeUsedInMs = executionResult.OutputResult.TimeUsed!,
                };
            }

            if (executionResult.TaskResult != null)
            {
                result.ExecutionResult.TaskResult = new TaskResultServiceModel
                {
                    Points = executionResult.TaskResult!.Points,
                    TestResults = executionResult
                        .TaskResult
                        .TestResults
                        .Select(tr => new TestResultServiceModel
                        {
                            Id = tr.Id,
                            ResultType = tr.ResultType.ToString(),
                            Output = tr.CheckerDetails != null
                                ? tr.CheckerDetails.UserOutputFragment
                                : string.Empty,
                            ExecutionComment = tr.ExecutionComment,
                            MemoryUsed = tr.MemoryUsed,
                            TimeUsed = tr.TimeUsed,
                        }),
                };
            }

            // result.SetExecutionResult(executionResult.Map<ExecutionResultResponseModel>());
        }
        catch (Exception ex)
        {
            result.SetException(ex, true);
        }

        return this.publisher.Publish(result);
    }
}