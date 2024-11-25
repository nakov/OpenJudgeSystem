namespace OJS.Services.Ui.Data.Implementations
{
    using Microsoft.EntityFrameworkCore;
    using OJS.Data;
    using OJS.Data.Models.Participants;
    using OJS.Data.Models.Submissions;
    using OJS.Services.Common.Data.Implementations;
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

        public Task<ParticipantScore?> GetByParticipantIdProblemIdAndIsOfficial(int participantId, int problemId, bool isOfficial) =>
            this.One(ps =>
                    ps.ParticipantId == participantId &&
                    ps.ProblemId == problemId &&
                    ps.IsOfficial == isOfficial);

        public IQueryable<ParticipantScore> GetAll() =>
            this.GetQuery();

        public async Task AddBySubmissionByUsernameAndIsOfficial(Submission submission, string username, bool isOfficial, Participant participant)
        {
            await this.Add(new ParticipantScore
            {
                ParticipantId = submission.ParticipantId,
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

        public Task<Dictionary<int, int?>> GetMaxByProblemIdsAndParticipation(
            IEnumerable<int> problemIds, IEnumerable<int> participantIds)
            => this.GetQuery(ps =>
                    problemIds.Contains(ps.ProblemId)
                    && participantIds.Contains(ps.ParticipantId))
                .GroupBy(ps => ps.ProblemId)
                .Select(ps =>
                    new ParticipationForProblemMaxScoreServiceModel
                    {
                        ProblemId = ps.Key,
                        Points = ps.Select(score => score.Points)
                            .Max(),
                    })
                .ToDictionaryAsync(
                    ps => ps.ProblemId,
                    ps => ps.Points);

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