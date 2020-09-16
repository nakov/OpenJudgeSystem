namespace OJS.LocalWorker
{
    using System;
    using System.Linq;

    using OJS.Data.Models;
    using OJS.Services.Data.Participants;
    using OJS.Services.Data.ParticipantScores;
    using OJS.Services.Data.Submissions;
    using OJS.Services.Data.SubmissionsForProcessing;
    using OJS.Services.Data.TestRuns;
    using OJS.Workers.Common;
    using OJS.Workers.Common.Models;
    using OJS.Workers.ExecutionStrategies.Models;
    using OJS.Workers.SubmissionProcessors;
    using OJS.Workers.SubmissionProcessors.Models;

    public class OjsSubmissionProcessingStrategy : SubmissionProcessingStrategy<int>
    {
        private readonly ISubmissionsDataService submissionsData;
        private readonly ITestRunsDataService testRunsData;
        private readonly IParticipantsDataService participantsData;
        private readonly IParticipantScoresDataService participantScoresData;
        private readonly ISubmissionsForProcessingDataService submissionsForProcessingData;

        public OjsSubmissionProcessingStrategy(
            ISubmissionsDataService submissionsData,
            ITestRunsDataService testRunsData,
            IParticipantsDataService participantsData,
            IParticipantScoresDataService participantScoresData,
            ISubmissionsForProcessingDataService submissionsForProcessingData)
        {
            this.submissionsData = submissionsData;
            this.testRunsData = testRunsData;
            this.participantsData = participantsData;
            this.participantScoresData = participantScoresData;
            this.submissionsForProcessingData = submissionsForProcessingData;
        }

        public override IOjsSubmission RetrieveSubmission()
        {
            lock (this.SubmissionsForProcessing)
            {
                var submissionId = this.GetSubmissionId();

                if (submissionId < 0)
                {
                    return null;
                }

                this.Logger.InfoFormat($"Submission #{submissionId} retrieved from data store successfully");

                var (newSubmission, newSubmissionForProcessing) = this.GetSubmissionAndSubmissionForProcessing(submissionId);

                var isSuccessful = this.VerifySubmissionAndSubmissionForProcessing(
                    newSubmission,
                    newSubmissionForProcessing,
                    submissionId);

                if (!isSuccessful)
                {
                    return null;
                }

                this.SetSubmissionToProcessing(newSubmission, newSubmissionForProcessing);

                return this.GetSubmissionModel(newSubmission);
            }
        }

        public override void BeforeExecute(int submissionId)
        {
            var (submission, submissionForProcessing) = this.GetSubmissionAndSubmissionForProcessing(submissionId);
            submission.ProcessingComment = null;
            this.testRunsData.DeleteBySubmission(submission.Id);
        }

        public override void OnError(IOjsSubmission submissionModel)
        {
            var (submission, submissionForProcessing) = this.GetSubmissionAndSubmissionForProcessing((int)submissionModel.Id);
            submission.ProcessingComment = submissionModel.ProcessingComment;

            this.UpdateResults(submission, submissionForProcessing);
        }

        protected override void ProcessTestsExecutionResult(
            IExecutionResult<TestResult> executionResult,
            int submissionId)
        {
            var (submission, submissionForProcessing) = this.GetSubmissionAndSubmissionForProcessing(submissionId);
            submission.IsCompiledSuccessfully = executionResult.IsCompiledSuccessfully;
            submission.CompilerComment = executionResult.CompilerComment;

            if (!executionResult.IsCompiledSuccessfully)
            {
                this.UpdateResults(submission, submissionForProcessing);
                return;
            }

            submission.TestRuns = executionResult.Results
                .Select(testResult => new TestRun
                {
                    CheckerComment = testResult.CheckerDetails.Comment,
                    ExpectedOutputFragment = testResult.CheckerDetails.ExpectedOutputFragment,
                    UserOutputFragment = testResult.CheckerDetails.UserOutputFragment,
                    ExecutionComment = testResult.ExecutionComment,
                    MemoryUsed = testResult.MemoryUsed,
                    ResultType = testResult.ResultType,
                    TestId = testResult.Id,
                    TimeUsed = testResult.TimeUsed
                })
                .ToList();

            this.submissionsData.Update(submission);

            this.UpdateResults(submission, submissionForProcessing);
        }

        private (Submission, SubmissionForProcessing) GetSubmissionAndSubmissionForProcessing(int submissionId)
            => (this.submissionsData.GetById(submissionId),
                this.submissionsForProcessingData.GetBySubmission(submissionId));

        private bool VerifySubmissionAndSubmissionForProcessing(
            Submission newSubmission,
            SubmissionForProcessing newSubmissionForProcessing,
            int submissionId)
        {
            if (newSubmission != null && newSubmissionForProcessing != null)
            {
                return true;
            }

            this.Logger.Error($"Cannot retrieve submission #{submissionId} from database");
            return false;
        }

        private int GetSubmissionId()
        {
            if (this.SubmissionsForProcessing.IsEmpty)
            {
                this.submissionsForProcessingData
                    .GetAllUnprocessed()
                    .OrderBy(x => x.Id)
                    .Select(x => x.SubmissionId)
                    .ToList()
                    .ForEach(this.SubmissionsForProcessing.Enqueue);
            }

            var isSubmissionRetrieved = this.SubmissionsForProcessing.TryDequeue(out var submissionId);

            return isSubmissionRetrieved
                ? submissionId
                : -1;
        }

        private void UpdateResults(Submission submission, SubmissionForProcessing submissionForProcessing)
        {
            this.CalculatePointsForSubmission(submission);

            this.SaveParticipantScore(submission);

            this.CacheTestRuns(submission);

            this.SetSubmissionToProcessed(submission, submissionForProcessing);
        }

        private void CalculatePointsForSubmission(Submission submission)
        {
            try
            {
                // Internal joke: submission.Points = new Random().Next(0, submission.Problem.MaximumPoints + 1) + Weather.Instance.Today("Sofia").IsCloudy ? 10 : 0;
                if (submission.Problem.Tests.Count == 0 || submission.TestsWithoutTrialTestsCount == 0)
                {
                    submission.Points = 0;
                }
                else
                {
                    var coefficient = (double)submission.CorrectTestRunsWithoutTrialTestsCount /
                        submission.TestsWithoutTrialTestsCount;

                    submission.Points = (int)(coefficient * submission.Problem.MaximumPoints);
                }
            }
            catch (Exception ex)
            {
                this.Logger.ErrorFormat(
                    "CalculatePointsForSubmission on submission #{0} has thrown an exception: {1}",
                    submission.Id,
                    ex);

                submission.ProcessingComment = $"Exception in CalculatePointsForSubmission: {ex.Message}";
            }
        }

        private void SaveParticipantScore(Submission submission)
        {
            try
            {
                if (submission.ParticipantId == null || submission.ProblemId == null)
                {
                    return;
                }

                var participant = this.participantsData
                    .GetByIdQuery(submission.ParticipantId.Value)
                    .Select(p => new
                    {
                        p.IsOfficial,
                        p.User.UserName
                    })
                    .FirstOrDefault();

                if (participant == null)
                {
                    return;
                }

                ParticipantScore existingScore;

                lock (this.SharedLockObject)
                {
                    existingScore = this.participantScoresData.GetByParticipantIdProblemIdAndIsOfficial(
                        submission.ParticipantId.Value,
                        submission.ProblemId.Value,
                        participant.IsOfficial);

                    if (existingScore == null)
                    {
                        this.participantScoresData.AddBySubmissionByUsernameAndIsOfficial(
                            submission,
                            participant.UserName,
                            participant.IsOfficial);

                        return;
                    }
                }

                if (submission.Points > existingScore.Points ||
                    submission.Id == existingScore.SubmissionId)
                {
                    this.participantScoresData.UpdateBySubmissionAndPoints(
                        existingScore,
                        submission.Id,
                        submission.Points);
                }
            }
            catch (Exception ex)
            {
                this.Logger.ErrorFormat(
                    "SaveParticipantScore on submission #{0} has thrown an exception: {1}",
                    submission.Id,
                    ex);

                submission.ProcessingComment = $"Exception in SaveParticipantScore: {ex.Message}";
            }
        }

        private void SetSubmissionToProcessed(Submission submission, SubmissionForProcessing submissionForProcessing)
        {
            try
            {
                submission.Processed = true;
                submissionForProcessing.Processed = true;
                submissionForProcessing.Processing = false;

                this.submissionsData.Update(submission);
                this.submissionsForProcessingData.Update(submissionForProcessing);
            }
            catch (Exception ex)
            {
                this.Logger.ErrorFormat(
                    "Unable to save changes to the submission #{0}! Exception: {1}",
                    submission.Id,
                    ex);
            }
        }

        private void SetSubmissionToProcessing(Submission submission, SubmissionForProcessing submissionForProcessing)
        {
            try
            {
                submissionForProcessing.Processed = false;
                submissionForProcessing.Processing = true;

                this.submissionsForProcessingData.Update(submissionForProcessing);
            }
            catch (Exception ex)
            {
                this.Logger.ErrorFormat(
                    "Unable to set submission #{0} to processing! Exception: {1}",
                    submission.Id,
                    ex);
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
                this.Logger.ErrorFormat(
                    "CacheTestRuns on submission #{0} has thrown an exception: {1}",
                    submission.Id,
                    ex);

                submission.ProcessingComment = $"Exception in CacheTestRuns: {ex.Message}";
            }
        }

        private IOjsSubmission GetSubmissionModel(Submission submission) => new OjsSubmission<TestsInputModel>()
        {
            Id = submission.Id,
            AdditionalCompilerArguments = submission.SubmissionType.AdditionalCompilerArguments,
            AllowedFileExtensions = submission.SubmissionType.AllowedFileExtensions,
            FileContent = submission.Content,
            CompilerType = submission.SubmissionType.CompilerType,
            TimeLimit = submission.Problem.TimeLimit,
            MemoryLimit = submission.Problem.MemoryLimit,
            ExecutionStrategyType = submission.SubmissionType.ExecutionStrategyType,
            ExecutionType = ExecutionType.TestsExecution,
            Input = new TestsInputModel
            {
                TaskSkeleton = submission.Problem.SolutionSkeleton,
                CheckerParameter = submission.Problem.Checker.Parameter,
                CheckerAssemblyName = submission.Problem.Checker.DllFile,
                CheckerTypeName = submission.Problem.Checker.ClassName,
                Tests = submission.Problem.Tests
                    .AsQueryable()
                    .Select(t => new TestContext
                    {
                        Id = t.Id,
                        Input = t.InputDataAsString,
                        Output = t.OutputDataAsString,
                        IsTrialTest = t.IsTrialTest,
                        OrderBy = t.OrderBy
                    })
                    .ToList()
            }
        };
    }
}