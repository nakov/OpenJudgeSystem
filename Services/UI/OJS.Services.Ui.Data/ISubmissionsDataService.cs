using OJS.Services.Ui.Models.Submissions;

namespace OJS.Services.Ui.Data;

using OJS.Data.Models.Submissions;
using OJS.Services.Common.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public interface ISubmissionsDataService : IDataService<Submission>
{
    Task<IEnumerable<TServiceModel>> GetLatestSubmissions<TServiceModel>(int count);

    Submission? GetBestForParticipantByProblem(int participantId, int problemId);

    IQueryable<Submission> GetAllByProblem(int problemId);

    IQueryable<Submission> GetAllByProblemAndParticipant(int problemId, int participantId);

    Task<IEnumerable<TServiceModel>> GetAllFromContestsByLecturer<TServiceModel>(string lecturerId);

    Task<IEnumerable<TServiceModel>> GetAllCreatedBeforeDateAndNonBestCreatedBeforeDate<TServiceModel>(
        DateTime createdBeforeDate,
        DateTime nonBestCreatedBeforeDate);

    IQueryable<Submission> GetAllHavingPointsExceedingLimit();

    Task<IEnumerable<int>> GetIdsByProblem(int problemId);

    Task<IEnumerable<TServiceModel>> GetAllByIdsQuery<TServiceModel>(IEnumerable<int> ids);

    bool IsOfficialById(int id);

    void SetAllToUnprocessedByProblem(int problemId);

    void DeleteByProblem(int problemId);

    void RemoveTestRunsCacheByProblem(int problemId);

    bool HasSubmissionTimeLimitPassedForParticipant(int participantId, int limitBetweenSubmissions);

    bool HasUserNotProcessedSubmissionForProblem(int problemId, string userId);

    Task<int> GetSubmissionsPerDayCount();

    Task<IEnumerable<TServiceModel>> GetAllByProblemAndUser<TServiceModel>(int problemId, string userId, int? take = Constants.Submissions.DefaultCount);
}