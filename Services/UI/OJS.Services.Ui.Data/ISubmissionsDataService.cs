namespace OJS.Services.Ui.Data;

using OJS.Data.Models.Submissions;
using OJS.Services.Common.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using OJS.Services.Infrastructure.Models;

public interface ISubmissionsDataService : IDataService<Submission>
{
    Task<TServiceModel?> GetSubmissionById<TServiceModel>(int id);

    IQueryable<TServiceModel> GetLatestSubmissions<TServiceModel>(int? limit = null);

    Task<PagedResult<TServiceModel>> GetLatestSubmissionsByUserParticipations<TServiceModel>(
        IEnumerable<int?> userParticipantsIds,
        int submissionsPerPage,
        int pageNumber);

    Task<int> GetParticipantIdBySubmission(int submissionId);

    Task<int> GetProblemIdBySubmission(int submissionId);

    Task<int> GetSubmissionsPerDayCount();

    Submission? GetBestForParticipantByProblem(int participantId, int problemId);

    IQueryable<Submission> GetAllByProblem(int problemId);

    IQueryable<Submission> GetAllByProblemAndParticipant(int problemId, int participantId);

    IQueryable<Submission> GetAllFromContestsByLecturer(string lecturerId);

    IQueryable<Submission> GetAllCreatedBeforeDateAndNonBestCreatedBeforeDate(
        DateTime createdBeforeDate,
        DateTime nonBestCreatedBeforeDate);

    IQueryable<Submission> GetAllHavingPointsExceedingLimit();

    IQueryable<Submission> GetAllByIdsQuery(IEnumerable<int> ids);

    IQueryable<int> GetIdsByProblem(int problemId);

    IQueryable<Submission> GetAllForUserByContest(int contestId, string userId);

    bool IsOfficialById(int id);

    void SetAllToUnprocessedByProblem(int problemId);

    void DeleteByProblem(int problemId);

    void RemoveTestRunsCacheByProblem(int problemId);

    Task<int> GetUserSubmissionTimeLimit(int participantId, int limitBetweenSubmissions);

    Task<bool> HasUserNotProcessedSubmissionForProblem(int problemId, string userId);

    Task<bool> HasUserNotProcessedSubmissionForContest(int contestId, string userId);
}