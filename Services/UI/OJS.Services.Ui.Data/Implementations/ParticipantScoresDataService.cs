namespace OJS.Services.Ui.Data.Implementations
{
    using Microsoft.EntityFrameworkCore;
    using OJS.Data;
    using OJS.Data.Models.Participants;
    using OJS.Data.Models.Submissions;
    using OJS.Services.Common.Data.Implementations;
    using OJS.Services.Infrastructure.Extensions;
    using OJS.Services.Ui.Models.Participations;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    public class ParticipantScoresDataService : DataService<ParticipantScore>, IParticipantScoresDataService
    {
        private readonly IParticipantsDataService participantsData;

        public ParticipantScoresDataService(
            OjsDbContext db,
            IParticipantsDataService participantsData)
            : base(db)
            => this.participantsData = participantsData;

        public Task<IEnumerable<ParticipantScore>> GetWithSubmissionsAndTestsByParticipantId(int participantId)
            => this.DbSet
                .Where(ps => ps.ParticipantId == participantId)
                .Include(ps => ps.Submission)
                    .ThenInclude(s => s!.TestRuns)
                .ToEnumerableAsync();

        public Task<ParticipantScore?> GetByParticipantIdAndProblemId(int participantId, int problemId) =>
            this.DbSet
                .FirstOrDefaultAsync(ps =>
                    ps.ParticipantId == participantId &&
                    ps.ProblemId == problemId);

        public Task<IEnumerable<ParticipantScore>> GetByProblemIdAndParticipants(IEnumerable<int> participantIds, int problemId)
            => this.DbSet
                .Where(ps => ps.ProblemId == problemId)
                .Where(p => participantIds.Contains(p.ParticipantId))
                .ToEnumerableAsync();

        public Task<ParticipantScore?> GetByParticipantIdProblemIdAndIsOfficial(int participantId, int problemId, bool isOfficial) =>
            this.DbSet
                .FirstOrDefaultAsync(ps =>
                    ps.ParticipantId == participantId &&
                    ps.ProblemId == problemId &&
                    ps.IsOfficial == isOfficial);

        public IQueryable<ParticipantScore> GetAll() =>
            this.DbSet;

        public IQueryable<ParticipantScore> GetAllByProblem(int problemId) =>
            this.GetAll()
                .Where(ps => ps.ProblemId == problemId);

        public IQueryable<ParticipantScore> GetAllHavingPointsExceedingLimit() =>
            this.GetAll()
                .Where(ps => ps.Points > ps.Problem.MaximumPoints);

        public async Task ResetBySubmission(Submission submission)
        {
            if (submission.ParticipantId == null)
            {
                return;
            }

            var participant = await this.participantsData
                .GetByIdQuery(submission.ParticipantId.Value)
                .Select(p => new
                {
                    p.IsOfficial,
                    p.User.UserName,
                    Participant = p,
                })
                .FirstOrDefaultAsync();

            if (participant == null)
            {
                return;
            }

            var existingScore = await this.GetByParticipantIdProblemIdAndIsOfficial(
                submission.ParticipantId.Value,
                submission.ProblemId,
                participant.IsOfficial);

            if (existingScore == null)
            {
                await this.AddBySubmissionByUsernameAndIsOfficial(submission, participant.UserName, participant.IsOfficial, participant.Participant);
            }
            else
            {
                await this.UpdateBySubmissionAndPoints(existingScore, submission.Id, submission.Points, participant.Participant);
            }
        }

        public Task DeleteAllByProblem(int problemId) =>
            this.DbSet
                .Where(x => x.ProblemId == problemId)
                .DeleteFromQueryAsync();

        public async Task DeleteForParticipantByProblem(int participantId, int problemId)
        {
            var isOfficial = await this.participantsData.IsOfficialById(participantId);

            var existingScore = await this.GetByParticipantIdProblemIdAndIsOfficial(participantId, problemId, isOfficial);

            if (existingScore != null)
            {
                this.Delete(existingScore);
                await this.SaveChanges();
            }
        }

        public async Task Delete(IEnumerable<ParticipantScore> participantScores)
        {
            foreach (var participantScore in participantScores)
            {
                this.Delete(participantScore);
            }

            await this.SaveChanges();
        }

        public async Task AddBySubmissionByUsernameAndIsOfficial(Submission submission, string username, bool isOfficial, Participant participant)
        {
            await this.Add(new ParticipantScore
            {
                ParticipantId = submission.ParticipantId!.Value,
                ProblemId = submission.ProblemId,
                SubmissionId = submission.Id,
                ParticipantName = username,
                Points = submission.Points,
                IsOfficial = isOfficial,
            });

            UpdateTotalScoreSnapshot(participant, 0, submission.Points, true);
            this.participantsData.Update(participant);

            await this.SaveChanges();
        }

        public async Task UpdateBySubmissionAndPoints(
            ParticipantScore participantScore,
            int? submissionId,
            int submissionPoints,
            Participant participant)
        {
            // The submission TotalScoreSnapshotModifiedOn must be changed only if it is new submission in other way the results will not be ordered correctly.
            var shouldUpdateTotalScoreDate = submissionId != null && submissionId != participantScore.SubmissionId;
            UpdateTotalScoreSnapshot(
                participant,
                participantScore.Points,
                submissionPoints,
                shouldUpdateTotalScoreDate);

            participantScore.SubmissionId = submissionId;
            participantScore.Points = submissionPoints;

            this.Update(participantScore);
            this.participantsData.Update(participant);
            await this.SaveChanges();
        }

        public Task RemoveSubmissionIdsBySubmissionIds(IEnumerable<int> submissionIds) =>
            this.DbSet
                .Where(ps => submissionIds.Cast<int?>().Contains(ps.SubmissionId))
                .UpdateFromQueryAsync(
                    ps => new ParticipantScore
                    {
                        SubmissionId = null,
                    });

        public Task<IEnumerable<ParticipationForProblemMaxScoreServiceModel>> GetMaxByProblemIdsAndParticipation(
            IEnumerable<int> problemIds, IEnumerable<int> participantIds)
            => this.DbSet
                .Where(ps =>
                    problemIds.Contains(ps.ProblemId)
                    && participantIds.Contains(ps.ParticipantId))
                .GroupBy(ps => ps.ProblemId)
                .Select(ps =>
                    new ParticipationForProblemMaxScoreServiceModel
                    {
                        ProblemId = ps.Key,
                        Points = ps.Select(ps => ps.Points)
                            .Max(),
                    })
                .ToEnumerableAsync();

        private static void UpdateTotalScoreSnapshot(
            Participant participant,
            int previousPoints,
            int newPoints,
            bool shouldUpdateDate)
        {
            participant.TotalScoreSnapshot = (participant.TotalScoreSnapshot - previousPoints) + newPoints;
            if (shouldUpdateDate)
            {
                participant.TotalScoreSnapshotModifiedOn = DateTime.Now;
            }
        }
    }
}