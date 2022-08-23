using System.Collections.Generic;
using OJS.Services.Business.ParticipantScores.Models;

namespace OJS.Services.Business.ParticipantScores
{
    using OJS.Services.Common;

    public interface IParticipantScoresBusinessService : IService
    {
        void RecalculateForParticipantByProblem(int participantId, int problemId);

        void NormalizeAllPointsThatExceedAllowedLimit();

        ServiceResult<ParticipationsSummaryServiceModel> GetParticipationSummary(int id, bool official);
    }
}