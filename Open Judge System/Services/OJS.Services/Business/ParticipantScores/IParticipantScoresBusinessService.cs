namespace OJS.Services.Business.ParticipantScores
{
    using OJS.Data.Models;
    using OJS.Services.Common;

    public interface IParticipantScoresBusinessService : IService
    {
        void RecalculateForParticipantByProblem(int participantId, int problemId);

        void NormalizeAllPointsThatExceedAllowedLimit();

        void SaveForSubmission(Submission submission);
    }
}