namespace OJS.Services.Common;

using System.Threading.Tasks;

public interface IParticipantsBackgroundJobsBusinessService
{
    Task UpdateTotalScoreSnapshotOfParticipants();

    Task RemoveParticipantMultipleScores();
}