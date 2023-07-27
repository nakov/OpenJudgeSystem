using OJS.Services.Common.Models.Submissions.ExecutionDetails;
using OJS.Workers.Common.Models;

namespace OJS.Services.Common.Implementations;

using OJS.PubSub.Worker.Submissions;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using OJS.Data.Models.Submissions;
using OJS.Workers.ExecutionStrategies.Models;
using System.Linq;
using System.Threading.Tasks;

public class SubmissionPublisherService : ISubmissionPublisherService
{
    private readonly IPublisherService publisher;

    public SubmissionPublisherService(
        IPublisherService publisher)
        => this.publisher = publisher;

    public Task Publish(Submission submission)
    {
        var tests = submission.Problem!.Tests
            .Select(t => new TestContext
            {
                Id = t.Id,
                Input = t.InputDataAsString,
                Output = t.OutputDataAsString,
                IsTrialTest = t.IsTrialTest,
                OrderBy = (int)t.OrderBy,
            });

        var (fileContent, code) = GetSubmissionContent(submission);

        var pubSubModel = new SubmissionForProcessingPubSubModel
        {
            Id = submission.Id,
            ExecutionType = ExecutionType.TestsExecution,
            ExecutionStrategy = submission.SubmissionType!.ExecutionStrategyType,
            Code = code,
            FileContent = fileContent,
            TimeLimit = submission.Problem.TimeLimit,
            MemoryLimit = submission.Problem.MemoryLimit,
            TestsExecutionDetails = new TestsExecutionDetailsServiceModel
            {
                CheckerType = submission.Problem.Checker?.ClassName,
                CheckerParameter = submission.Problem.Checker?.Parameter,
                TaskSkeleton = submission.SolutionSkeleton,
                MaxPoints = submission.Problem.MaximumPoints,
                Tests = tests,
            },
        };

        return this.publisher.Publish(pubSubModel);
    }

    private static (byte[]? fileContent, string code) GetSubmissionContent(Submission submission)
    {
        byte[]? fileContent = null;
        var code = string.Empty;

        if (submission.IsBinaryFile)
        {
            fileContent = submission.Content;
        }
        else
        {
            code = submission.ContentAsString;
        }

        return (fileContent, code);
    }
}