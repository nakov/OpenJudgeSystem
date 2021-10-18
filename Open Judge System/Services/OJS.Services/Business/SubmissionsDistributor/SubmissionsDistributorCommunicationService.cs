namespace OJS.Services.Business.SubmissionsDistributor
{
    using OJS.Common;
    using OJS.Data.Models;
    using OJS.Services.Business.Submissions.Models;
    using OJS.Services.Common.HttpRequester;
    using OJS.Services.Common.HttpRequester.Models;
    using OJS.Services.Data.Submissions;
    using OJS.Services.Data.SubmissionsForProcessing;
    using OJS.Workers.Common.Extensions;
    using OJS.Workers.Common.Models;
    using OJS.Workers.SubmissionProcessors.Formatters;
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Linq;
    using System.Threading.Tasks;

    public class SubmissionsDistributorCommunicationService : ISubmissionsDistributorCommunicationService
    {
        private readonly IFormatterServiceFactory formatterServiceFactory;
        private readonly IHttpRequesterService httpRequester;
        private readonly ISubmissionsDataService submissionsData;
        private readonly ISubmissionsForProcessingDataService submissionsForProcessingData;
        private readonly string distributorBaseUrl;
        private readonly string apiKey;
        private readonly int submissionsToAddToDistributorBatchSize;

        public SubmissionsDistributorCommunicationService(
            IFormatterServiceFactory formatterServiceFactory,
            IHttpRequesterService httpRequester,
            ISubmissionsDataService submissionsData,
            ISubmissionsForProcessingDataService submissionsForProcessingData,
            string distributorBaseUrl,
            string apiKey,
            int submissionsToAddToDistributorBatchSize)
        {
            this.formatterServiceFactory = formatterServiceFactory;
            this.httpRequester = httpRequester;
            this.submissionsData = submissionsData;
            this.submissionsForProcessingData = submissionsForProcessingData;
            this.distributorBaseUrl = distributorBaseUrl;
            this.apiKey = apiKey;
            this.submissionsToAddToDistributorBatchSize = submissionsToAddToDistributorBatchSize;
        }

        // TODO: Pass a Service model instead of Data model
        public Task<ExternalDataRetrievalResult<SubmissionAddedToDistributorResponseServiceModel>> AddSubmissionForProcessing(
            Submission submission)
        {
            var url = string.Format(UrlConstants.AddSubmissionToDistributor, this.distributorBaseUrl);

            var requestBody = this.BuildDistributorSubmissionBody(submission);

            return this.httpRequester
                .GetAsync<SubmissionAddedToDistributorResponseServiceModel>(requestBody, url, this.apiKey);
        }

        public void AddAllUnprocessed()
        {
            var unprocessedSubmissionIds = this.submissionsForProcessingData
                .GetAllUnprocessed()
                .Select(s => s.SubmissionId)
                .ToList();

            if (!unprocessedSubmissionIds.Any())
            {
                return;
            }

            var submissionsToAdd = this.submissionsData
                .GetAllByIdsQuery(unprocessedSubmissionIds)
                .Include(s => s.Problem.Checker)
                .Include(s => s.Problem.Tests)
                .ToList();

            this.BatchAddSubmissionsForProcessing(submissionsToAdd, this.submissionsToAddToDistributorBatchSize);
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

        private Task<ExternalDataRetrievalResult<SubmissionAddedToDistributorResponseServiceModel>> AddManySubmissionsForProcessing(
            IEnumerable<Submission> submissions)
        {
            var url = string.Format(UrlConstants.AddManySubmissionsToDistributor, this.distributorBaseUrl);

            var requestBody = submissions.Select(this.BuildDistributorSubmissionBody).ToList();

            return this.httpRequester
                .GetAsync<SubmissionAddedToDistributorResponseServiceModel>(requestBody, url, this.apiKey);
        }

        private void BatchAddSubmissionsForProcessing(ICollection<Submission> submissions, int batchSize)
        {
            var submissionsAddedCount = 0;

            while (submissionsAddedCount < submissions.Count)
            {
                var batchToAdd = submissions
                    .Skip(submissionsAddedCount)
                    .Take(batchSize);

                var response = this.AddManySubmissionsForProcessing(batchToAdd).Result;

                if (!response.IsSuccess)
                {
                    throw new Exception(response.ErrorMessage);
                }

                submissionsAddedCount += batchSize;
            }
        }
    }
}
