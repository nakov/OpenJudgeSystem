namespace OJS.Services.Administration.Business.Implementations
{
    using Microsoft.EntityFrameworkCore;
    using OJS.Common;
    using OJS.Common.Enumerations;
    using OJS.Common.Helpers;
    using OJS.Data.Models.Submissions;
    using OJS.Services.Administration.Data;
    using OJS.Services.Administration.Models;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    public class SubmissionsBusinessService : ISubmissionsBusinessService
    {
        private readonly ISubmissionsDataService submissionsData;
        // private readonly IArchivedSubmissionsDataService archivedSubmissionsData;
        private readonly IParticipantScoresDataService participantScoresData;

        public SubmissionsBusinessService(
            ISubmissionsDataService submissionsData,
            IParticipantScoresDataService participantScoresData)
        {
            this.submissionsData = submissionsData;
            // this.archivedSubmissionsData = archivedSubmissionsData;
            this.participantScoresData = participantScoresData;
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

        // public async Task HardDeleteAllArchived() =>
        //     (await this.archivedSubmissionsData
        //         .GetAllUndeletedFromMainDatabase())
        //         .Select(s => s.Id)
        //         .AsEnumerable()
        //         .ChunkBy(GlobalConstants.BatchOperationsChunkSize)
        //         .ForEach(submissionIds =>
        //             this.HardDeleteByArchivedIds(new HashSet<int>(submissionIds)));

        // private Task HardDeleteByArchivedIds(ICollection<int> ids)
        // {
        //     using (var scope = TransactionsHelper.CreateTransactionScope(IsolationLevel.ReadCommitted))
        //     {
        //         this.participantScoresData.RemoveSubmissionIdsBySubmissionIds(ids);
        //         this.submissionsData.Delete(s => ids.Contains(s.Id));
        //
        //         this.archivedSubmissionsData.SetToHardDeletedFromMainDatabaseByIds(ids);
        //
        //         scope.Complete();
        //     }
        //
        //     return Task.CompletedTask;
        // }
    }
}