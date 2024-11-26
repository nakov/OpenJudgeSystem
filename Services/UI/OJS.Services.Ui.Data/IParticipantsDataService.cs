namespace OJS.Services.Ui.Data
{
    using OJS.Common.Enumerations;
    using OJS.Data.Models.Participants;
    using OJS.Services.Common.Data;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    public interface IParticipantsDataService : IDataService<Participant>
    {
        Task<Participant?> GetByContestByUserAndByIsOfficial(int contestId, string userId, bool isOfficial);

        IQueryable<Participant> GetWithProblemsForParticipantsByContestAndUser(int contestId, string userId);

        IQueryable<Participant> GetAllByUser(string? userId);

        IQueryable<Participant> GetAllByContestByUserAndIsOfficial(int contestId, string userId, bool isOfficial);

        IQueryable<Participant> GetAllByUsernameAndContests(string username, IEnumerable<int> contestIds);

        IQueryable<Participant> GetAllByContestWithScoresAndProblems(int contestId);

        Task<bool> ExistsByContestByUserAndIsOfficial(int contestId, string userId, bool isOfficial);

        Task<IDictionary<int, int>> GetParticipantsCountInContests(IEnumerable<int> contestIds, bool isOfficial);
    }
}