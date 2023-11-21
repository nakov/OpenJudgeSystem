namespace OJS.Services.Administration.Business;

using SoftUni.Services.Infrastructure;
using System.Threading.Tasks;

public interface IParticipantsBusinessService : IService
{
    Task UpdateTotalScoreSnapshotOfParticipants();

    Task RemoveParticipantMultipleScores();
}