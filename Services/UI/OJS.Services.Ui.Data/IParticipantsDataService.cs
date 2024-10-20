namespace OJS.Services.Ui.Data
{
    using OJS.Data.Models.Participants;
    using OJS.Services.Common.Data;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Threading.Tasks;

    public interface IParticipantsDataService : IDataService<Participant>
    {
        Task<Participant?> GetByContestByUserAndByIsOfficial(int contestId, string userId, bool isOfficial);

        Task<Participant?> GetWithContestAndProblemsForParticipantByContestByUserAndIsOfficial(int contestId, string userId, bool isOfficial);

        IQueryable<Participant> GetWithProblemsForParticipantsByContestAndUser(int contestId, string userI);

        Task<Participant?> GetWithProblemsForParticipantsByContestByUserAndIsOfficial(int contestId, string userId, bool isOfficial);

        IQueryable<Participant> GetAllByUser(string? userId);

        IQueryable<Participant> GetAllByUsername(string username);

        IQueryable<Participant> GetAllByUsernameAndContests(string usernam, IEnumerable<int> contestIds);

        IQueryable<Participant> GetAllByContest(int contestId);

        IQueryable<Participant> GetAllByContestWithScoresAndProblems(int contestId);

        IQueryable<Participant> GetAllOfficialByContest(int contestId);

        IQueryable<Participant> GetAllOfficialInOnlineContestByContestAndParticipationStartTimeRange(
            int contestId,
            DateTime participationStartTimeRangeStart,
            DateTime participationStartTimeRangeEnd);

        Task<bool> ExistsByIdAndContest(int id, int contestId);

        Task<bool> ExistsByContestAndUser(int contestId, string userId);

        Task<bool> ExistsByContestByUserAndIsOfficial(int contestId, string userId, bool isOfficial);

        Task<bool> IsOfficialById(int id);

        Task<IDictionary<int, int>> GetParticipantsCountInContests(IEnumerable<int> contestIds, bool isOfficial);

        Task Update(
            IQueryable<Participant> participantsQuery,
            Expression<Func<Participant, Participant>> updateExpression);

        Task Delete(IEnumerable<Participant> participants);

        Task InvalidateByContestAndIsOfficial(int contestId, bool isOfficial);
    }
}