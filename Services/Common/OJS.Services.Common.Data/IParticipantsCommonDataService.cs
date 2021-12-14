namespace OJS.Services.Common.Data;

using OJS.Data.Models.Participants;
using System.Linq;

public interface IParticipantsCommonDataService : IDataService<Participant>
{
    IQueryable<Participant> GetAllByContest(int contestId);

    IQueryable<Participant> GetAllByContestAndIsOfficial(int contestId, bool isOfficial);
}