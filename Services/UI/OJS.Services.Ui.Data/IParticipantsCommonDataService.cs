namespace OJS.Services.Ui.Data;

using OJS.Data.Models.Participants;
using OJS.Services.Common.Data;
using System.Linq;

public interface IParticipantsCommonDataService : IDataService<Participant>
{
    IQueryable<Participant> GetAllByContest(int contestId);

    IQueryable<Participant> GetAllByContestAndIsOfficial(int contestId, bool isOfficial);
}