namespace OJS.Services.Administration.Business.Participants;

using Microsoft.EntityFrameworkCore;
using OJS.Data.Models.Participants;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.Participants;
using System.Linq;
using System.Threading.Tasks;

public class ParticipantsBusinessService : AdministrationOperationService<Participant, int, ParticipantAdministrationModel>, IParticipantsBusinessService
{
    private readonly IParticipantsDataService participantsData;
    private readonly IParticipantScoresDataService scoresDataService;

    public ParticipantsBusinessService(
        IParticipantsDataService participantsData,
        IParticipantScoresDataService scoresDataService)
    {
        this.participantsData = participantsData;
        this.scoresDataService = scoresDataService;
    }

    public override Task<ParticipantAdministrationModel> Create(ParticipantAdministrationModel model) => base.Create(model);

    public async Task UpdateTotalScoreSnapshotOfParticipants()
        => await this.participantsData.UpdateTotalScoreSnapshot();

    public async Task RemoveDuplicateParticipantScores()
    {
        var duplicateGroups = await this.scoresDataService
            .GetAll()
            .GroupBy(ps => new { ps.IsOfficial, ps.ProblemId, ps.ParticipantId })
            .Where(psGroup => psGroup.Count() > 1)
            .Select(psGroup => new
            {
                GroupKey = psGroup.Key,
                ScoresToRemove = psGroup
                    .OrderByDescending(ps => ps.Points)
                    .Skip(1),
            })
            .ToListAsync();

        var participantScoresToRemove = duplicateGroups
            .SelectMany(group => group.ScoresToRemove)
            .ToList();

        await this.scoresDataService.Delete(participantScoresToRemove);
    }

    public IQueryable<Participant> GetByContest(int contestId)
        => this.participantsData.GetAllByContest(contestId);
}