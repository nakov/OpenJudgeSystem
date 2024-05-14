namespace OJS.Services.Common.Data;

using OJS.Data.Models.Participants;
using System.Collections.Generic;
using System.Linq;

public interface IParticipantScoresCommonDataService
{
    IQueryable<ParticipantScore> GetAllByParticipants(IEnumerable<int> participantIds);
}