namespace OJS.Services.Ui.Business.Implementations
{
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Options;
    using OJS.Data.Models.Submissions;
    using OJS.Services.Common.Models;
    using OJS.Services.Common.Models.Submissions;
    using OJS.Services.Infrastructure.HttpClients;
    using OJS.Services.Ui.Data;
    using OJS.Services.Ui.Models.Configurations;
    using SoftUni.Judge.Common.Enumerations;
    using SoftUni.Judge.Common.Extensions;
    using SoftUni.Judge.Common.Formatters;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using static OJS.Common.GlobalConstants.Urls;

    public class SubmissionsDistributorCommunicationService : ISubmissionsDistributorCommunicationService
    {
        private readonly IFormatterServiceFactory formatterServiceFactory;
        private readonly IDistributorHttpClientService distributorHttpClient;
        private readonly ISubmissionsDataService submissionsData;
        private readonly ISubmissionsForProcessingDataService submissionsForProcessingData;
        private readonly DistributorConfig distributorConfig;

        public SubmissionsDistributorCommunicationService(
            IFormatterServiceFactory formatterServiceFactory,
            IDistributorHttpClientService distributorHttpClient,
            ISubmissionsDataService submissionsData,
            ISubmissionsForProcessingDataService submissionsForProcessingData,
            IOptions<DistributorConfig> distributorConfigAccessor)
        {
            this.formatterServiceFactory = formatterServiceFactory;
            this.distributorHttpClient = distributorHttpClient;
            this.submissionsData = submissionsData;
            this.submissionsForProcessingData = submissionsForProcessingData;
            this.distributorConfig = distributorConfigAccessor.Value;
        }

        // TODO: Pass a Service model instead of Data model
        public Task<ExternalDataRetrievalResult<SubmissionAddedToDistributorResponseServiceModel>> AddSubmissionForProcessing(
            Submission submission)
        {
            var requestBody = this.BuildDistributorSubmissionBody(submission);

            return this.distributorHttpClient
                .GetAsync<SubmissionAddedToDistributorResponseServiceModel>(
                    requestBody,
                    AddSubmissionToDistributorPath);
        }

        public Task<ExternalDataRetrievalResult<SubmissionAddedToDistributorResponseServiceModel>> AddSubmissionsForProcessing(
            IEnumerable<Submission> submissions)
            => this.BatchAddSubmissionsForProcessing(
                submissions.ToList(),
                this.distributorConfig.SubmissionsToAddBatchSize);

        public async Task AddAllUnprocessed()
        {
            var unprocessedSubmissionIds = await this.submissionsForProcessingData
                .GetAllUnprocessed()
                .Select(s => s.SubmissionId)
                .ToListAsync();

            if (!unprocessedSubmissionIds.Any())
            {
                return;
            }

            var submissionsToAdd = await this.submissionsData
                .GetAllByIdsQuery(unprocessedSubmissionIds)
                .Include(s => s.Problem.Checker)
                .Include(s => s.Problem.Tests)
                .ToListAsync();

            await this.BatchAddSubmissionsForProcessing(
                submissionsToAdd,
                this.distributorConfig.SubmissionsToAddBatchSize);
        }

        private object BuildDistributorSubmissionBody(Submission submission)
        {
            var executionType = ExecutionType.TestsExecution.ToString().ToHyphenSeparatedWords();

            var executionStrategy = this.formatterServiceFactory
                .Get<ExecutionStrategyType>()
                ?.Format(submission.SubmissionType.ExecutionStrategyType);

            var checkerType = this.formatterServiceFactory
               .Get<string>()
               ?.Format(submission.Problem.Checker.ClassName);

           var (fileContent, code) = this.GetSubmissionContent(submission);

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
                submission.Id,
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
            var requestBody = submissions.Select(this.BuildDistributorSubmissionBody).ToList();

            return this.distributorHttpClient
                .GetAsync<SubmissionAddedToDistributorResponseServiceModel>(
                    requestBody,
                    AddManySubmissionsToDistributorPath);
        }

        private async Task<ExternalDataRetrievalResult<SubmissionAddedToDistributorResponseServiceModel>> BatchAddSubmissionsForProcessing(
            ICollection<Submission> submissions,
            int batchSize)
        {
            var submissionsAddedCount = 0;

            ExternalDataRetrievalResult<SubmissionAddedToDistributorResponseServiceModel> response = null;

            while (submissionsAddedCount < submissions.Count)
            {
                var batchToAdd = submissions
                    .Skip(submissionsAddedCount)
                    .Take(batchSize);

                response = await this.AddManySubmissionsForProcessing(batchToAdd).ConfigureAwait(false);

                if (!response.IsSuccess)
                {
                    throw new Exception(response.ErrorMessage);
                }

                submissionsAddedCount += batchSize;
            }

            return response;
        }

        private (byte[] fileContent, string code) GetSubmissionContent(Submission submission)
        {
            byte[] fileContent = null;
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
}