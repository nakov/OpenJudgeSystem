using OJS.Data.Models.Submissions;
using OJS.Services.Common.Models.PubSubContracts.Submissions;
using OJS.Workers.Common.Models;
using OJS.Workers.ExecutionStrategies.Models;
using OJS.Workers.SubmissionProcessors.Formatters;
using System.Linq;
using System.Threading.Tasks;

namespace OJS.Services.Common.Implementations;

public class SubmissionPublisherService : ISubmissionPublisherService
{
    private readonly IPublisherService publisher;
    private readonly IFormatterServiceFactory formatterServiceFactory;

    public SubmissionPublisherService(IPublisherService publisher, IFormatterServiceFactory formatterServiceFactory)
    {
        this.publisher = publisher;
        this.formatterServiceFactory = formatterServiceFactory;
    }

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

        var checkerTypeName = this.formatterServiceFactory
            .Get<string>()
            ?.Format(submission.Problem!.Checker!.ClassName!);

        var (fileContent, code) = GetSubmissionContent(submission);

        var model = new SubmissionSubmitted
        {
            Id = submission.Id,
            FileContent = fileContent,
            Code = code,
            ExecutionType = ExecutionType.TestsExecution,
            ExecutionStrategy = submission.SubmissionType!.ExecutionStrategyType,
            MemoryLimit = submission.Problem.MemoryLimit,
            TimeLimit = submission.Problem.TimeLimit,
            TestsExecutionDetails = new TestsExecutionDetails
            {
                CheckerTypeName = checkerTypeName,
                CheckerParameter = submission.Problem.Checker?.Parameter,
                SolutionSkeleton = submission.SolutionSkeleton,
                MaxPoints = submission.Problem.MaximumPoints,
                Tests = tests,
            },
        };

        return this.publisher.Publish(model);
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