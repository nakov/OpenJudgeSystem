namespace OJS.Services.Common.Data.Implementations;

using OJS.Data;
using OJS.Data.Models.Participants;
using OJS.Services.Common.Data;
using System.Linq;

public class ParticipantsCommonDataService : DataService<Participant>, IParticipantsCommonDataService
{
    public ParticipantsCommonDataService(OjsDbContext db)
        : base(db)
    {
    }

    public IQueryable<Participant> GetAllByContest(int contestId)
        => this.GetQuery(p => p.ContestId == contestId);

    public IQueryable<Participant> GetAllByContestAndIsOfficial(int contestId, bool isOfficial)
        => this.GetAllByContest(contestId)
            .Where(p => p.IsOfficial == isOfficial);
}