namespace OJS.Services.Common.Data.Implementations;

using Microsoft.EntityFrameworkCore;
using OJS.Data.Models.Participants;
using System.Linq;

public class ParticipantsCommonDataService :  DataService<Participant>, IParticipantsCommonDataService
{
    public ParticipantsCommonDataService(DbContext db) : base(db)
    {
    }

    public IQueryable<Participant> GetAllByContest(int contestId)
        => this.DbSet
            .Where(p => p.ContestId == contestId);

    public IQueryable<Participant> GetAllByContestAndIsOfficial(int contestId, bool isOfficial)
        => this.GetAllByContest(contestId)
            .Where(p => p.IsOfficial == isOfficial);
}