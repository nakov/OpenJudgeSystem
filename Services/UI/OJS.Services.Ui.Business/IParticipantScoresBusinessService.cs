namespace OJS.Services.Ui.Business
{
    using OJS.Data.Models.Participants;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using OJS.Data.Models.Submissions;
    using OJS.Services.Ui.Models.Participations;
    using OJS.Services.Ui.Models.Problems;
    using OJS.Services.Infrastructure;

    public interface IParticipantScoresBusinessService : IService
    {
        Task SaveForSubmission(Participant participant, Submission submission);

        Task<IEnumerable<ProblemResultServiceModel>> GetParticipantScoresByProblemForUser(int problemId, bool isOfficial);

        Task<IEnumerable<ParticipationForProblemMaxScoreServiceModel>> GetAllForParticipant(int participantId);
    }
}