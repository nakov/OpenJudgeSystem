namespace OJS.Services.Administration.Business;

using SoftUni.Services.Infrastructure;
using System.Threading.Tasks;

public interface IParticipantsBusinessService : IService
{
    /// <summary>
    /// Updates the total score snapshot for all participants.
    /// </summary>
    Task UpdateTotalScoreSnapshotOfParticipants();

    /// <summary>
    /// For each group, it keeps the score with the highest points and remove multiple duplicate scores.
    /// </summary>
    Task RemoveDuplicateParticipantScores();
}