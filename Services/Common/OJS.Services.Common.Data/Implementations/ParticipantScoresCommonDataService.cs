namespace OJS.Services.Common.Data.Implementations;

using Microsoft.EntityFrameworkCore;
using OJS.Data.Models.Participants;
using System.Collections.Generic;
using System.Linq;

public class ParticipantScoresCommonDataService : DataService<ParticipantScore>, IParticipantScoresCommonDataService
{
    public ParticipantScoresCommonDataService(DbContext db)
        : base(db)
    {
    }

    public IQueryable<ParticipantScore> GetAll() =>
        this.DbSet;

    public IQueryable<ParticipantScore> GetAllByParticipants(IEnumerable<int> participantIds) =>
        this.GetAll()
            .Where(ps => !ps.Problem.IsDeleted && participantIds.Contains(ps.ParticipantId));
}