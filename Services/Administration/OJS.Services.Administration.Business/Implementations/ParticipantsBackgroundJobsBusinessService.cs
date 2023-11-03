namespace OJS.Services.Administration.Business.Implementations;

using OJS.Services.Ui.Data;
using OJS.Services.Common;
using OJS.Data.Models.Participants;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class ParticipantsBackgroundJobsBusinessService : IParticipantsBackgroundJobsBusinessService
{
    private readonly IParticipantsDataService participantsData;
    private readonly IParticipantScoresDataService scoresDataService;

    public ParticipantsBackgroundJobsBusinessService(
        IParticipantsDataService participantsData,
        IParticipantScoresDataService scoresDataService)
    {
        this.participantsData = participantsData;
        this.scoresDataService = scoresDataService;
    }

    public async Task UpdateTotalScoreSnapshotOfParticipants()
        => await this.participantsData.UpdateTotalScoreSnapshot();

    public async Task RemoveParticipantMultipleScores()
    {
        var participantScores =
            this.scoresDataService
                .GetAll()
                .GroupBy(ps => new { ps.IsOfficial, ps.ProblemId, ps.ParticipantId })
                .Where(ps => ps.Count() > 1)
                .ToList();

        var participantScoresToRemove = new List<ParticipantScore>();
        participantScores.ForEach(participantScoreGroup =>
        {
            participantScoresToRemove
                .AddRange(participantScoreGroup
                    .OrderByDescending(ps => ps.Points)
                    .Skip(1)
                    .ToList());
        });

        await this.scoresDataService.Delete(participantScoresToRemove);
    }
}