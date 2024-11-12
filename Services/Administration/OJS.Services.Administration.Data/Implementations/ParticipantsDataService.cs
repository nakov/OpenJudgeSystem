namespace OJS.Services.Administration.Data.Implementations
{
    using Microsoft.EntityFrameworkCore;
    using OJS.Common.Enumerations;
    using OJS.Data;
    using OJS.Data.Models.Participants;
    using OJS.Data.Models.Problems;
    using OJS.Services.Common.Data;
    using OJS.Services.Common.Models.Users;
    using System;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Threading.Tasks;

    public class ParticipantsDataService : AdministrationDataService<Participant>, IParticipantsDataService
    {
        private readonly IParticipantsCommonDataService participantsCommonData;

        public ParticipantsDataService(
            OjsDbContext db,
            IParticipantsCommonDataService participantsCommonData)
            : base(db)
            => this.participantsCommonData = participantsCommonData;

        public Task<Participant?> GetByContestByUserAndByIsOfficial(
            int contestId,
            string userId,
            bool isOfficial)
            => this.GetAllByContestByUserAndIsOfficial(contestId, userId, isOfficial)
                .FirstOrDefaultAsync();

        public IQueryable<Participant> GetAllOfficialByContest(int contestId)
            => this.participantsCommonData
                .GetAllByContest(contestId)
                .Where(p => p.IsOfficial);

        public IQueryable<Participant> GetAllOfficialInOnlineContestByContestAndParticipationStartTimeRange(
            int contestId,
            DateTime participationStartTimeRangeStart,
            DateTime participationStartTimeRangeEnd)
            => this.GetAllOfficialByContest(contestId)
                    .Where(p =>
                        p.ParticipationStartTime >= participationStartTimeRangeStart &&
                        p.ParticipationStartTime <= participationStartTimeRangeEnd &&
                        p.Contest.Type == ContestType.OnlinePracticalExam);

        public Task<bool> IsOfficialById(int id)
            => this.GetByIdQuery(id)
                .Select(p => p.IsOfficial)
                .FirstOrDefaultAsync();

        public Task InvalidateByContestAndIsOfficial(int contestId, bool isOfficial)
            => this.participantsCommonData
                .GetAllByContestAndIsOfficial(contestId, isOfficial)
                .UpdateFromQueryAsync(p => new Participant
                {
                    IsInvalidated = true,
                });

        public async Task UpdateTotalScoreSnapshot()
        {
            var totalScoreSnapshot = nameof(Participant.TotalScoreSnapshot);
            var problemId = nameof(ParticipantScore.ProblemId);
            var points = nameof(ParticipantScore.Points);
            var participantId = nameof(Participant.Id);

            var command = $@"DECLARE @BatchSize INT = 5000;
               DECLARE @MaxId INT = (SELECT MAX(Id) FROM Participants);
               DECLARE @Offset INT = 0;

               WHILE @Offset <= @MaxId
               BEGIN
                   WITH OrderedParticipants AS (
                   SELECT TOP (@BatchSize) {participantId}
               FROM Participants
               WHERE {participantId} > @Offset
               ORDER BY {participantId}
                   )
               UPDATE p
               SET {totalScoreSnapshot} = ISNULL((
                   SELECT SUM(ps.{points})
               FROM ParticipantScores ps
                   JOIN Problems pr ON ps.{problemId} = pr.{nameof(ParticipantScore.Id)} AND pr.{nameof(Problem.IsDeleted)} = 0
               WHERE ps.{nameof(ParticipantScore.ParticipantId)} = p.{participantId}
                   ), 0)
               FROM OrderedParticipants op
                   JOIN Participants p ON op.{participantId} = p.{participantId};

               SET @Offset = @Offset + @BatchSize;
               END;";

            await this.ExecuteSqlCommandWithTimeout(command, 0);
        }

        public IQueryable<Participant> GetAllByContest(int contestId)
            => this.GetQuery(p => p.ContestId == contestId);

        protected override Expression<Func<Participant, bool>> GetUserFilter(UserInfoModel user)
            => participant => user.IsAdmin ||
                              participant.Contest.Category!.LecturersInContestCategories.Any(cc => cc.LecturerId == user.Id) ||
                          participant.Contest.LecturersInContests.Any(l => l.LecturerId == user.Id);

        private IQueryable<Participant> GetAllByContestAndUser(int contestId, string userId) =>
            this.participantsCommonData
                .GetAllByContest(contestId)
                .Where(p => p.UserId == userId);

        private IQueryable<Participant> GetAllByContestByUserAndIsOfficial(
            int contestId,
            string userId,
            bool isOfficial)
            => this.GetAllByContestAndUser(contestId, userId)
                .Where(p => p.IsOfficial == isOfficial);
    }
}