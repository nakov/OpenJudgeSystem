namespace OJS.Services.Business.SubmissionsDistributor
{
    using OJS.Data.Models;
    using OJS.Workers.Common;
    using OJS.Workers.Common.Extensions;
    using OJS.Workers.Common.Models;
    using OJS.Workers.SubmissionProcessors.Common;
    using OJS.Workers.SubmissionProcessors.Formatters;

    using System.Linq;
    using System.Threading.Tasks;

    public class SubmissionsDistributorCommunicationService : ISubmissionsDistributorCommunicationService
    {
        private readonly string addSubmissionEndpoint;
        private readonly HttpService http;
        private readonly IFormatterServiceFactory formatterServiceFactory;

        public SubmissionsDistributorCommunicationService(
            IFormatterServiceFactory formatterServiceFactory)
        {
            this.formatterServiceFactory = formatterServiceFactory;
            this.addSubmissionEndpoint = $"{Settings.DistributorServiceLocation}/submissions/add";
            this.http = new HttpService();
        }

        // TODO: Pass a Service model instead of Data model
        public Task AddSubmissionForProcessing(Submission submission)
        {
            var requestBody = this.BuildDistributorSubmissionBody(submission);

            return this.http.PostJsonAsync(this.addSubmissionEndpoint, requestBody);
        }

        private object BuildDistributorSubmissionBody(Submission submission)
        {
            var executionType = ExecutionType.TestsExecution.ToString().ToHyphenSeparatedWords();

            var executionStrategy = this.formatterServiceFactory
                .Get<ExecutionStrategyType>()
                .Format(submission.SubmissionType.ExecutionStrategyType);

            var checkerType = this.formatterServiceFactory
               .Get<string>()
               .Format(submission.Problem.Checker.ClassName);

            var fileContent = string.IsNullOrEmpty(submission.ContentAsString)
                ? submission.Content
                : null;

            var code = submission.ContentAsString ?? string.Empty;

            var tests = submission.Problem.Tests
                .Select(t => new
                {
                    t.Id,
                    Input = t.InputData,
                    Output = t.OutputDataAsString,
                    t.IsTrialTest,
                    t.OrderBy,
                });

            var submissionRequestBody = new
            {
                Id = submission.Id,
                ExecutionType = executionType,
                ExecutionStrategy = executionStrategy,
                FileContent = fileContent,
                Code = code,
                submission.Problem.TimeLimit,
                submission.Problem.MemoryLimit,
                ExecutionDetails = new
                {
                    MaxPoints = submission.Problem.MaximumPoints,
                    CheckerType = checkerType,
                    Tests = tests,
                    submission.Problem.SolutionSkeleton
                },
            };

            return submissionRequestBody;
        }
    }
}
