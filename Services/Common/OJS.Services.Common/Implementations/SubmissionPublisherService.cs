using OJS.Data.Models.Submissions;
using OJS.Services.Common.Models.PubSubContracts.Submissions;
using OJS.Workers.Common.Models;
using System.Linq;
using System.Threading.Tasks;

namespace OJS.Services.Common.Implementations;

public class SubmissionPublisherService : ISubmissionPublisherService
{
    private readonly IPublisherService publisher;

    public SubmissionPublisherService(IPublisherService publisher)
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
                OrderBy = t.OrderBy,
            });

        var model = new SubmissionSubmitted
        {
            Id = submission.Id,
            Content = submission.Content,
            ExecutionType = ExecutionType.TestsExecution,
            ExecutionStrategy = submission.SubmissionType?.ExecutionStrategyType,
            MemoryLimit = submission.Problem.MemoryLimit,
            TimeLimit = submission.Problem.TimeLimit,
            TestsExecutionDetails = new TestsExecutionDetails
            {
                CheckerTypeName = submission.Problem.Checker?.ClassName,
                CheckerParameter = submission.Problem.Checker?.Parameter,
                SolutionSkeleton = submission.SolutionSkeleton,
                MaxPoints = submission.Problem.MaximumPoints,
                Tests = tests,
            },
        };

        return this.publisher.Publish(model);
    }
}