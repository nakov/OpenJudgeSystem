namespace OJS.Services.Business.Submissions
{
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Linq;
    using System.Transactions;

    using MissingFeatures;

    using OJS.Common;
    using OJS.Common.Extensions;
    using OJS.Common.Helpers;
    using OJS.Data.Models;
    using OJS.Data.Repositories.Contracts;
    using OJS.Services.Busines.Submissions.Models;
    using OJS.Services.Business.ParticipantScores;
    using OJS.Services.Business.Submissions.Models;
    using OJS.Services.Common.Exceptions;
    using OJS.Services.Data.ParticipantScores;
    using OJS.Services.Data.Submissions;
    using OJS.Services.Data.Submissions.ArchivedSubmissions;
    using OJS.Services.Data.SubmissionsForProcessing;
    using OJS.Services.Data.TestRuns;
    using OJS.Workers.Common.Models;

    public class SubmissionsBusinessService : ISubmissionsBusinessService
    {
        private readonly IEfDeletableEntityRepository<Submission> submissions;
        private readonly ISubmissionsDataService submissionsData;
        private readonly IArchivedSubmissionsDataService archivedSubmissionsData;
        private readonly IParticipantScoresDataService participantScoresData;
        private readonly ISubmissionsForProcessingDataService submissionsForProcessingData;
        private readonly ITestRunsDataService testRunsData;
        private readonly IParticipantScoresBusinessService participantScoresBusiness;

        public SubmissionsBusinessService(
            IEfDeletableEntityRepository<Submission> submissions,
            ISubmissionsDataService submissionsData,
            IArchivedSubmissionsDataService archivedSubmissionsData,
            IParticipantScoresDataService participantScoresData,
            ISubmissionsForProcessingDataService submissionsForProcessingData,
            ITestRunsDataService testRunsData,
            IParticipantScoresBusinessService participantScoresBusiness)
        {
            this.submissions = submissions;
            this.submissionsData = submissionsData;
            this.archivedSubmissionsData = archivedSubmissionsData;
            this.participantScoresData = participantScoresData;
            this.submissionsForProcessingData = submissionsForProcessingData;
            this.testRunsData = testRunsData;
            this.participantScoresBusiness = participantScoresBusiness;
        }

        public IQueryable<Submission> GetAllForArchiving()
        {
            var archiveBestSubmissionsLimit = DateTime.Now.AddYears(
                -GlobalConstants.BestSubmissionEligibleForArchiveAgeInYears);

            var archiveNonBestSubmissionsLimit = DateTime.Now.AddYears(
                -GlobalConstants.NonBestSubmissionEligibleForArchiveAgeInYears);

            return this.submissionsData
                .GetAllCreatedBeforeDateAndNonBestCreatedBeforeDate(
                    archiveBestSubmissionsLimit,
                    archiveNonBestSubmissionsLimit);
        }

        public void RecalculatePointsByProblem(int problemId)
        {
            using (var scope = TransactionsHelper.CreateTransactionScope())
            {
                var problemSubmissions = this.submissionsData
                    .GetAllByProblem(problemId)
                    .Include(s => s.TestRuns)
                    .Include(s => s.TestRuns.Select(tr => tr.Test))
                    .ToList();

                var submissionResults = problemSubmissions
                    .Select(s => new
                    {
                        s.Id,
                        s.ParticipantId,
                        CorrectTestRuns = s.TestRuns.Count(t =>
                            t.ResultType == TestRunResultType.CorrectAnswer &&
                            !t.Test.IsTrialTest),
                        AllTestRuns = s.TestRuns.Count(t => !t.Test.IsTrialTest),
                        MaxPoints = s.Problem.MaximumPoints
                    })
                    .ToList();

                var problemSubmissionsById = problemSubmissions.ToDictionary(s => s.Id);
                var topResults = new Dictionary<int, ParticipantScoreModel>();

                foreach (var submissionResult in submissionResults)
                {
                    var submission = problemSubmissionsById[submissionResult.Id];
                    var points = 0;
                    if (submissionResult.AllTestRuns != 0)
                    {
                        points = (submissionResult.CorrectTestRuns * submissionResult.MaxPoints) /
                            submissionResult.AllTestRuns;
                    }

                    submission.Points = points;
                    submission.CacheTestRuns();

                    if (!submissionResult.ParticipantId.HasValue)
                    {
                        continue;
                    }

                    var participantId = submissionResult.ParticipantId.Value;

                    if (!topResults.ContainsKey(participantId) || topResults[participantId].Points < points)
                    {
                        topResults[participantId] = new ParticipantScoreModel
                        {
                            Points = points,
                            SubmissionId = submission.Id
                        };
                    }
                    else if (topResults[participantId].Points == points)
                    {
                        if (topResults[participantId].SubmissionId < submission.Id)
                        {
                            topResults[participantId].SubmissionId = submission.Id;
                        }
                    }
                }

                this.submissions.SaveChanges();

                var participants = topResults.Keys.ToList();

                var existingScores = this.participantScoresData
                    .GetAllByProblem(problemId)
                    .Where(p => participants.Contains(p.ParticipantId))
                    .ToList();

                foreach (var existingScore in existingScores)
                {
                    var topScore = topResults[existingScore.ParticipantId];

                    existingScore.Points = topScore.Points;
                    existingScore.SubmissionId = topScore.SubmissionId;
                }

                this.submissions.SaveChanges();

                scope.Complete();
            }
        }

        public void HardDeleteAllArchived() =>
            this.archivedSubmissionsData
                .GetAllUndeletedFromMainDatabase()
                .Select(s => s.Id)
                .AsEnumerable()
                .ChunkBy(GlobalConstants.BatchOperationsChunkSize)
                .ForEach(submissionIds =>
                    this.HardDeleteByArchivedIds(new HashSet<int>(submissionIds)));

        private void HardDeleteByArchivedIds(ICollection<int> ids)
        {
            using (var scope = TransactionsHelper.CreateTransactionScope(IsolationLevel.ReadCommitted))
            {
                this.participantScoresData.RemoveSubmissionIdsBySubmissionIds(ids);
                this.submissions.HardDelete(s => ids.Contains(s.Id));

                this.archivedSubmissionsData.SetToHardDeletedFromMainDatabaseByIds(ids);

                scope.Complete();
            }
        }

        public void ProcessExecutionResult(SubmissionExecutionResult submissionExecutionResult)
        {
            var submission = this.submissionsData
                .GetByIdQuery(submissionExecutionResult.SubmissionId)
                .Include(s => s.Problem.Tests)
                .FirstOrDefault();

            var submissionForProcessing = this.submissionsForProcessingData.GetBySubmission(submission?.Id ?? 0);

            if (submission == null || submissionForProcessing == null)
            {
                throw new BusinessServiceException(
                    $"Submission with Id: \"{submissionExecutionResult.SubmissionId}\" not found.");
            }

            var exception = submissionExecutionResult.Exception;
            var executionResult = submissionExecutionResult.ExecutionResult;

            submission.ProcessingComment = null;
            this.testRunsData.DeleteBySubmission(submission.Id);

            if (executionResult != null)
            {
                this.ProcessTestsExecutionResult(submission, executionResult);
            }
            else if (exception != null)
            {
                submission.ProcessingComment = exception.Message + Environment.NewLine + exception.StackTrace;
            }
            else
            {
                submission.ProcessingComment = "Invalid execution result received. Please contact an administrator.";
            }

            this.SetSubmissionToProcessed(submission, submissionForProcessing);
        }

        private void SaveParticipantScore(Submission submission)
        {
            try
            {
                this.participantScoresBusiness.SaveForSubmission(submission);
            }
            catch (Exception ex)
            {
                submission.ProcessingComment = $"Exception in SaveParticipantScore: {ex.Message}";
            }
        }

        private void CacheTestRuns(Submission submission)
        {
            try
            {
                submission.CacheTestRuns();
            }
            catch (Exception ex)
            {
                submission.ProcessingComment = $"Exception in CacheTestRuns: {ex.Message}";
            }
        }

        private void SetSubmissionToProcessed(Submission submission, SubmissionForProcessing submissionForProcessing)
        {
            submission.Processed = true;
            submissionForProcessing.Processed = true;
            submissionForProcessing.Processing = false;

            this.submissionsData.Update(submission);
            this.submissionsForProcessingData.Update(submissionForProcessing);
        }

        private void UpdateResults(Submission submission)
        {
            this.SaveParticipantScore(submission);

            this.CacheTestRuns(submission);
        }

        private void ProcessTestsExecutionResult(
            Submission submission,
            ExecutionResultResponseModel executionResult)
        {
            submission.IsCompiledSuccessfully = executionResult.IsCompiledSuccessfully;
            submission.CompilerComment = executionResult.CompilerComment;
            submission.Points = executionResult.TaskResult.Points;

            if (!executionResult.IsCompiledSuccessfully)
            {
                this.UpdateResults(submission);
                return;
            }

            var testResults = executionResult
                .TaskResult
                ?.TestResults
                ?? Enumerable.Empty<TestResultResponseModel>();

            foreach (var testResult in testResults)
            {
                var resultType = (TestRunResultType)Enum.Parse(typeof(TestRunResultType), testResult.ResultType);

                var testRun = new TestRun
                {
                    CheckerComment = testResult.CheckerDetails.Comment,
                    ExpectedOutputFragment = testResult.CheckerDetails.ExpectedOutputFragment,
                    UserOutputFragment = testResult.CheckerDetails.UserOutputFragment,
                    ExecutionComment = testResult.ExecutionComment,
                    MemoryUsed = testResult.MemoryUsed,
                    ResultType = resultType,
                    TestId = testResult.Id,
                    TimeUsed = testResult.TimeUsed,
                };

                submission.TestRuns.Add(testRun);
            }

            this.submissionsData.Update(submission);

            this.UpdateResults(submission);
        }
    }
}