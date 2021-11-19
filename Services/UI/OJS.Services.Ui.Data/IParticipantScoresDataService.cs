namespace OJS.Services.Ui.Data
{
    using OJS.Data.Models.Participants;
    using OJS.Services.Common.Data;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    public interface IParticipantScoresDataService : IDataService<ParticipantScore>
    {
        Task Delete(IEnumerable<ParticipantScore> participantScores);
    }
}