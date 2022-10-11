namespace OJS.Services.Business.ParticipantScores
{
    using OJS.Services.Common;
    using OJS.Services.Business.ParticipantScores.Models;

    public interface IParticipantScoresBusinessService : IService
    {
        void RecalculateForParticipantByProblem(int participantId, int problemId);

        void NormalizeAllPointsThatExceedAllowedLimit();

        CategoryContestsParticipationSummary GetCategoryParticipationSummary(int categoryId, bool showHidden, bool official);
    }
}