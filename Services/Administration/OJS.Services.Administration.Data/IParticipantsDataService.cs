namespace OJS.Services.Administration.Data
{
    using OJS.Data.Models.Participants;
    using OJS.Services.Common.Data;
    using System;
    using System.Linq;
    using System.Threading.Tasks;

    public interface IParticipantsDataService : IDataService<Participant>
    {
        Task<Participant?> GetByContestByUserAndByIsOfficial(int contestId, string userId, bool isOfficial);

        IQueryable<Participant> GetAllOfficialByContest(int contestId);

        IQueryable<Participant> GetAllOfficialInOnlineContestByContestAndParticipationStartTimeRange(
            int contestId,
            DateTime participationStartTimeRangeStart,
            DateTime participationStartTimeRangeEnd);

        Task<bool> IsOfficialById(int id);

        Task InvalidateByContestAndIsOfficial(int contestId, bool isOfficial);

        Task UpdateTotalScoreSnapshot();

        IQueryable<Participant> GetAllByContest(int contestId);
    }
}