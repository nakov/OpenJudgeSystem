namespace OJS.Services.Common.Data.Implementations;

using Microsoft.EntityFrameworkCore;
using OJS.Data;
using OJS.Data.Models.Participants;
using OJS.Services.Common.Data;
using OJS.Services.Common.Data.Implementations;
using System.Linq;

public class ParticipantsCommonDataService : DataService<Participant>, IParticipantsCommonDataService
{
    public ParticipantsCommonDataService(OjsDbContext db)
        : base(db)
    {
    }

    public IQueryable<Participant> GetAllByContest(int contestId)
        => this.DbSet
            .Where(p => p.ContestId == contestId);

    public IQueryable<Participant> GetAllByContestAndIsOfficial(int contestId, bool isOfficial)
        => this.GetAllByContest(contestId)
            .Where(p => p.IsOfficial == isOfficial);

    public IQueryable<Participant> GetAllByUserAndContest(string userId, int contestId)
        => this.DbSet
            .Where(p => p.UserId == userId && p.ContestId == contestId);

    public IQueryable<Participant> GetAllWithProblemsScoresAndSubmissionsByContestAndIsOfficial(
        int contestId,
        bool isOfficial)
        => this.GetAllByContestAndIsOfficial(contestId, isOfficial)
            .Include(p => p.ProblemsForParticipants)
            .Include(p => p.Scores)
                .ThenInclude(s => s.Problem)
                    .ThenInclude(p => p.ProblemGroup)
            .Include(p => p.Scores)
                .ThenInclude(s => s.Submission)
                    .ThenInclude(s => s!.SubmissionType);
}