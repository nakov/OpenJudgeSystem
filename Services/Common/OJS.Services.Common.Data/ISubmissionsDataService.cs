namespace OJS.Services.Common.Data
{
    using OJS.Data.Models.Submissions;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    public interface ISubmissionsDataService : IDataService<Submission>
    {
        Submission? GetBestForParticipantByProblem(int participantId, int problemId);

        IQueryable<Submission> GetByIdQuery(int id);

        IQueryable<Submission> GetAllByProblem(int problemId);

        IQueryable<Submission> GetAllByProblemAndParticipant(int problemId, int participantId);

        IQueryable<Submission> GetAllFromContestsByLecturer(string lecturerId);

        IQueryable<Submission> GetAllCreatedBeforeDateAndNonBestCreatedBeforeDate(
            DateTime createdBeforeDate,
            DateTime nonBestCreatedBeforeDate);

        IQueryable<Submission> GetAllHavingPointsExceedingLimit();

        IQueryable<int> GetIdsByProblem(int problemId);

        IQueryable<Submission> GetAllByIdsQuery(IEnumerable<int> ids);

        bool IsOfficialById(int id);

        void SetAllToUnprocessedByProblem(int problemId);

        void DeleteByProblem(int problemId);

        void RemoveTestRunsCacheByProblem(int problemId);

        bool HasSubmissionTimeLimitPassedForParticipant(int participantId, int limitBetweenSubmissions);

        bool HasUserNotProcessedSubmissionForProblem(int problemId, string userId);
    }
}