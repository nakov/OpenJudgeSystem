namespace OJS.Services.Administration.Business.Implementations
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.EntityFrameworkCore;
    using OJS.Common;
    using OJS.Common.Helpers;
    using OJS.Data.Models.Submissions;
    using OJS.Services.Administration.Data;
    using OJS.Services.Administration.Models;
    using OJS.Services.Common;
    using OJS.Services.Common.Data;
    using OJS.Services.Common.Models;
    using OJS.Services.Common.Models.Submissions.ExecutionContext;
    using OJS.Services.Infrastructure;
    using OJS.Workers.Common.Models;
    using SoftUni.AutoMapper.Infrastructure.Extensions;
    using SoftUni.Data.Infrastructure;

    public class SubmissionsBusinessService : ISubmissionsBusinessService
    {
        private readonly ISubmissionsDataService submissionsData;
        private readonly ISubmissionsForProcessingCommonDataService submissionsForProcessingDataService;
        private readonly IParticipantScoresDataService participantScoresData;
        private readonly IParticipantScoresBusinessService participantScoresBusinessService;
        private readonly ISubmissionsCommonBusinessService submissionsCommonBusinessService;
        private readonly ITransactionsProvider transactions;
        private readonly IDatesService dates;

        public SubmissionsBusinessService(
            ISubmissionsDataService submissionsData,
            IParticipantScoresDataService participantScoresData,
            ITransactionsProvider transactions,
            ISubmissionsForProcessingCommonDataService submissionsForProcessingDataService,
            IParticipantScoresBusinessService participantScoresBusinessService,
            ISubmissionPublisherService submissionPublisherService,
            IDatesService dates,
            ISubmissionsCommonBusinessService submissionsCommonBusinessService)
        {
            this.submissionsData = submissionsData;
            // this.archivedSubmissionsData = archivedSubmissionsData;
            this.participantScoresData = participantScoresData;
            this.transactions = transactions;
            this.submissionsForProcessingDataService = submissionsForProcessingDataService;
            this.participantScoresBusinessService = participantScoresBusinessService;
            this.dates = dates;
            this.submissionsCommonBusinessService = submissionsCommonBusinessService;
        }

        public Task<IQueryable<Submission>> GetAllForArchiving()
        {
            var archiveBestSubmissionsLimit = DateTime.Now.AddYears(
                -GlobalConstants.BestSubmissionEligibleForArchiveAgeInYears);

            var archiveNonBestSubmissionsLimit = DateTime.Now.AddYears(
                -GlobalConstants.NonBestSubmissionEligibleForArchiveAgeInYears);

            return Task.FromResult(this.submissionsData
                .GetAllCreatedBeforeDateAndNonBestCreatedBeforeDate(
                    archiveBestSubmissionsLimit,
                    archiveNonBestSubmissionsLimit));
        }

        public Task RecalculatePointsByProblem(int problemId)
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
                        MaxPoints = s.Problem!.MaximumPoints,
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
                            SubmissionId = submission.Id,
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

                this.submissionsData.SaveChanges();

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

                this.submissionsData.SaveChanges();

                scope.Complete();
            }

            return Task.CompletedTask;
        }

        public async Task<ServiceResult> Retest(Submission submission)
        {
            var submissionProblemId = submission.ProblemId!.Value;
            var submissionParticipantId = submission.ParticipantId!.Value;

            var result = await this.transactions.ExecuteInTransaction(async () =>
            {
                submission.Processed = false;
                submission.ModifiedOn = this.dates.GetUtcNow();

                var submissionIsBestSubmission = await this.IsBestSubmission(
                    submissionProblemId,
                    submissionParticipantId,
                    submission.Id);

                if (submissionIsBestSubmission)
                {
                    await this.participantScoresBusinessService.RecalculateForParticipantByProblem(
                        submissionParticipantId,
                        submissionProblemId);
                }

                await this.submissionsData.SaveChanges();

                return ServiceResult.Success;
            });

            await this.submissionsCommonBusinessService.PublishSubmissionForProcessing(submission.Map<SubmissionServiceModel>());

            return result;
        }

        public async Task<bool> IsBestSubmission(int problemId, int participantId, int submissionId)
        {
            var bestScore = await this.participantScoresData.GetByParticipantIdAndProblemId(participantId, problemId);

            return bestScore?.SubmissionId == submissionId;
        }
    }
}