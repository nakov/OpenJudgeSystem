namespace OJS.Services.Ui.Business
{
    using OJS.Data.Models.Participants;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using OJS.Data.Models.Submissions;
    using OJS.Services.Ui.Models.Participations;
    using OJS.Services.Ui.Models.Problems;
    using OJS.Services.Ui.Models.Submissions;
    using OJS.Services.Infrastructure;

    public interface IParticipantScoresBusinessService : IService
    {
        Task RecalculateForParticipantByProblem(int participantId, int problemId);

        Task NormalizeAllPointsThatExceedAllowedLimit();

        Task SaveForSubmission(Participant participant, Submission submission);

        Task<IEnumerable<ProblemResultServiceModel>> GetParticipantScoresByProblemForUser(int problemId, bool isOfficial);

        Task<IEnumerable<ParticipantScoreModel>> GetByProblemForParticipants(IEnumerable<int> participantIds, int problemId);

        Task<IEnumerable<ParticipationForProblemMaxScoreServiceModel>> GetAllForParticipant(int participantId);
    }
}