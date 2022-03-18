using OJS.Services.Ui.Models.Problems;
using System.Collections.Generic;

namespace OJS.Services.Ui.Business
{
    using OJS.Data.Models.Submissions;
    using SoftUni.Services.Infrastructure;
    using System.Threading.Tasks;

    public interface IParticipantScoresBusinessService : IService
    {
        Task RecalculateForParticipantByProblem(int participantId, int problemId);

        Task NormalizeAllPointsThatExceedAllowedLimit();

        Task SaveForSubmission(Submission submission);

        Task<IEnumerable<ProblemResultServiceModel>> GetParticipantScoresByProblemForUser(int problemId,
            bool isOfficial);
    }
}