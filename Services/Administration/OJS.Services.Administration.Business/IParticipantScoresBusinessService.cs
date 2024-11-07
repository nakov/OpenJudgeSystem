namespace OJS.Services.Administration.Business;

using OJS.Services.Infrastructure;
using System.Threading.Tasks;

public interface IParticipantScoresBusinessService : IService
{
    Task RecalculateForParticipantByProblem(int participantId, int problemId);

    Task NormalizeAllPointsThatExceedAllowedLimit();
}