namespace OJS.Services.Ui.Data
{
    using OJS.Data.Models.Participants;
    using OJS.Data.Models.Submissions;
    using OJS.Services.Common.Data;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    public interface IParticipantScoresDataService : IDataService<ParticipantScore>
    {
        Task<ParticipantScore?> GetByParticipantIdProblemIdAndIsOfficial(int participantId, int problemId, bool isOfficial);

        IQueryable<ParticipantScore> GetAll();

        Task AddBySubmissionByUsernameAndIsOfficial(Submission submission, string username, bool isOfficial, Participant participant);

        Task UpdateBySubmissionAndPoints(
            ParticipantScore participantScore,
            int? submissionId,
            int submissionPoints,
            Participant participant);

        Task<Dictionary<int, int?>> GetMaxByProblemIdsAndParticipation(
            IEnumerable<int> problemIds,
            IEnumerable<int> participantIds);
    }
}