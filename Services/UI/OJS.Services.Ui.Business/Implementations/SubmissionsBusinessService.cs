namespace OJS.Services.Ui.Business.Implementations
{
    using System;
    using System.Threading.Tasks;
    using System.Collections.Generic;
    using System.Linq;
    using Microsoft.EntityFrameworkCore;
    using OJS.Common;
    using OJS.Common.Helpers;
    using OJS.Data.Models.Submissions;
    using OJS.Services.Common.Data;
    using OJS.Services.Ui.Data;
    using OJS.Services.Ui.Models.Submissions;
    using SoftUni.Judge.Common.Enumerations;
    using SoftUni.AutoMapper.Infrastructure.Extensions;

    public class SubmissionsBusinessService : ISubmissionsBusinessService
    {
        private readonly ISubmissionsDataService submissionsData;

        private readonly IUsersBusinessService usersBusiness;
        private readonly IParticipantScoresDataService participantScoresData;

        public SubmissionsBusinessService(
            ISubmissionsDataService submissionsData,
            IParticipantScoresDataService participantScoresData,
            IUsersBusinessService usersBusiness)
        {
            this.submissionsData = submissionsData;
            this.participantScoresData = participantScoresData;
            this.usersBusiness = usersBusiness;
        }

        public async Task<SubmissionDetailsServiceModel?> GetById(int submissionId)
            => await this.submissionsData
                .GetByIdQuery(submissionId)
                .MapCollection<SubmissionDetailsServiceModel>()
                .FirstOrDefaultAsync();

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
                        MaxPoints = s.Problem!.MaximumPoints
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

        public async Task<IEnumerable<SubmissionForProfileServiceModel>> GetForProfileByUser(string? username)
        {
            var user = await this.usersBusiness.GetUserProfileByUsername(username);
            var data = await this.submissionsData
                .GetQuery()
                .Include(s => s.Problem)
                .Include(s => s.TestRuns)
                .Include(s => s.SubmissionType)
                .Where(s => s.Participant!.UserId == user!.Id)
                .Take(20)
                .OrderByDescending(s => s.CreatedOn)
                .MapCollection<SubmissionForProfileServiceModel>()
                .ToListAsync();

            return data;
        }
    }
}