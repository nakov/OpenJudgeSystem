namespace OJS.Services.Ui.Data;

using OJS.Data.Models.Submissions;
using OJS.Services.Common.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using OJS.Services.Infrastructure.Models;

public interface ISubmissionsDataService : IDataService<Submission>
{
    Task<TServiceModel?> GetSubmissionById<TServiceModel>(int id);

    IQueryable<TServiceModel> GetLatestSubmissions<TServiceModel>(int? limit = null);

    Task<PagedResult<TServiceModel>> GetLatestSubmissionsByUserParticipations<TServiceModel>(
        IEnumerable<int> userParticipantsIds,
        int submissionsPerPage,
        int pageNumber);

    Task<int> GetSubmissionsPerDayCount();

    Submission? GetBestForParticipantByProblem(int participantId, int problemId);

    IQueryable<Submission> GetAllByProblemAndParticipant(int problemId, int participantId);

    IQueryable<Submission> GetAllHavingPointsExceedingLimit();

    IQueryable<Submission> GetAllForUserByContest(int contestId, string userId);

    Task<int> GetUserSubmissionTimeLimit(int participantId, int limitBetweenSubmissions);

    Task<bool> HasUserNotProcessedSubmissionForProblem(int problemId, string userId);

    Task<bool> HasUserNotProcessedSubmissionForContest(int contestId, string userId);
}