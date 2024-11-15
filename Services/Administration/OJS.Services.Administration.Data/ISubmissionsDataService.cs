namespace OJS.Services.Administration.Data
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using OJS.Data.Models.Submissions;
    using OJS.Services.Common.Data;

    public interface ISubmissionsDataService : IDataService<Submission>
    {
        Submission? GetBestForParticipantByProblem(int participantId, int problemId);

        IQueryable<Submission> GetByIdQuery(int id);

        IQueryable<Submission> GetAllByProblem(int problemId);

        Task<int> GetCountByProblem(int problemId);

        IQueryable<Submission> GetAllByProblems(IEnumerable<int> problemIds);

        IQueryable<Submission> GetAllCreatedBeforeDateAndNonBestCreatedBeforeDate(
            DateTime createdBeforeDate,
            DateTime nonBestCreatedBeforeDate);

        IQueryable<Submission> GetAllHavingPointsExceedingLimit();

        IQueryable<Submission> GetAllBySubmissionTypeSentByRegularUsersInTheLastNMonths(int submissionTypeId, int monthsCount);

        Task SetAllToUnprocessedByProblem(int problemId);

        void DeleteByProblem(int problemId);

        new void Update(Submission submission);

        void RemoveTestRunsCacheByProblem(int problemId);

        Task<IEnumerable<TServiceModel>> GetAllNonDeletedByProblemId<TServiceModel>(int problemId);

        Task<IEnumerable<int>> GetIdsByProblemId(int problemId);
    }
}