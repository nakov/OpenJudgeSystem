namespace OJS.Services.Administration.Business;

using SoftUni.Services.Infrastructure;
using System.Threading.Tasks;

public interface IParticipantsBusinessService : IService
{
    // This method updates the total score snapshot for all participants
    Task UpdateTotalScoreSnapshotOfParticipants();

    // This method removes multiple scores associated with a participant
    // For each group, it keeps the score with the highest points and prepares to remove the rest.
    Task RemoveParticipantMultipleScores();
}