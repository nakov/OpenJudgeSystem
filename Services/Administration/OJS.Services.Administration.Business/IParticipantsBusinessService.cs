namespace OJS.Services.Administration.Business;

using SoftUni.Services.Infrastructure;
using System.Threading.Tasks;
using OJS.Services.Common.Data.Pagination;
using OJS.Data.Models.Participants;
using System.Linq;

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

    /// <summary>
    /// Gets the participants for specified contest.
    /// </summary>
    /// <param name="contestId">The id of the contest.</param>
    IQueryable<Participant> GetByContest(int contestId);
}