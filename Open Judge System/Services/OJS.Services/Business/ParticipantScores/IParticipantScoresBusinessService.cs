using System.Collections.Generic;
using OJS.Data.Models;
using OJS.Services.Business.ParticipantScores.Models;

namespace OJS.Services.Business.ParticipantScores
{
    using OJS.Services.Common;

    public interface IParticipantScoresBusinessService : IService
    {
        void RecalculateForParticipantByProblem(int participantId, int problemId);

        void NormalizeAllPointsThatExceedAllowedLimit();

        CategoryContestsParticipationSummary GetCategoryParticipationSummary(int categoryId, bool showHidden, bool official);
        
        ParticipationsSummaryServiceModel GetParticipationSummaryForContest(Contest contest, IEnumerable<ParticipantSummaryInfoServiceModel> participants, bool official);
    }
}