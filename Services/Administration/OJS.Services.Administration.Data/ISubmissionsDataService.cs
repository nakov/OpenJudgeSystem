using OJS.Data.Models.Submissions;
using OJS.Services.Common.Data;
using OJS.Services.Infrastructure;
using SoftUni.Services.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OJS.Services.Administration.Data
{
    public interface ISubmissionsDataService : IDataService<Submission>
    {
        Submission GetBestForParticipantByProblem(int participantId, int problemId);

        IQueryable<Submission> GetByIdQuery(int id);

        IQueryable<Submission> GetAllByProblem(int problemId);

        IQueryable<Submission> GetAllByProblemAndParticipant(int problemId, int participantId);

        IQueryable<Submission> GetAllFromContestsByLecturer(string lecturerId);

        IQueryable<Submission> GetAllCreatedBeforeDateAndNonBestCreatedBeforeDate(
            DateTime createdBeforeDate,
            DateTime nonBestCreatedBeforeDate);

        IQueryable<Submission> GetAllHavingPointsExceedingLimit();

        IQueryable<int> GetIdsByProblem(int problemId);

        bool IsOfficialById(int id);

        void SetAllToUnprocessedByProblem(int problemId);

        void DeleteByProblem(int problemId);

        void Update(Submission submission);

        void RemoveTestRunsCacheByProblem(int problemId);
    }
}