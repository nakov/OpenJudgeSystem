﻿namespace OJS.Services.Business.SubmissionsDistributor
{
    using OJS.Common;
    using OJS.Data.Models;
    using OJS.Services.Business.Submissions.Models;
    using OJS.Services.Common.HttpRequester;
    using OJS.Services.Common.HttpRequester.Models;
    using OJS.Workers.Common.Extensions;
    using OJS.Workers.Common.Models;
    using OJS.Workers.SubmissionProcessors.Formatters;

    using System.Linq;
    using System.Threading.Tasks;

    public class SubmissionsDistributorCommunicationService : ISubmissionsDistributorCommunicationService
    {
        private readonly IFormatterServiceFactory formatterServiceFactory;
        private readonly IHttpRequesterService httpRequester;
        private readonly string distributorBaseUrl;
        private readonly string apiKey;

        public SubmissionsDistributorCommunicationService(
            IFormatterServiceFactory formatterServiceFactory,
            IHttpRequesterService httpRequester,
            string distributorBaseUrl,
            string apiKey)
        {
            this.formatterServiceFactory = formatterServiceFactory;
            this.httpRequester = httpRequester;
            this.distributorBaseUrl = distributorBaseUrl;
            this.apiKey = apiKey;
            
        }

        // TODO: Pass a Service model instead of Data model
        public Task<ExternalDataRetrievalResult<SubmissionAddedToDistributorResponseServiceModel>> AddSubmissionForProcessing(
            Submission submission)
        {
            var url = string.Format(UrlConstants.AddSubmissionToDistributor, distributorBaseUrl);

            var requestBody = this.BuildDistributorSubmissionBody(submission);

            return this.httpRequester
                .GetAsync<SubmissionAddedToDistributorResponseServiceModel>(requestBody, url, this.apiKey);
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
                    Input = t.InputDataAsString,
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
