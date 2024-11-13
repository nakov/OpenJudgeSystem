namespace OJS.Services.Ui.Data.Implementations;

using Microsoft.EntityFrameworkCore;
using OJS.Common.Extensions;
using OJS.Data;
using OJS.Data.Models.Submissions;
using OJS.Services.Common.Data.Implementations;
using OJS.Services.Infrastructure;
using OJS.Services.Infrastructure.Extensions;
using OJS.Services.Infrastructure.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class SubmissionsDataService : DataService<Submission>, ISubmissionsDataService
{
    private readonly IDatesService datesService;

    public SubmissionsDataService(OjsDbContext db, IDatesService datesService)
        : base(db)
        => this.datesService = datesService;

    public Task<TServiceModel?> GetSubmissionById<TServiceModel>(int id)
        => this.GetByIdQuery(id)
            .AsNoTracking()
            .MapCollection<TServiceModel>()
            .FirstOrDefaultAsync();

    public IQueryable<TServiceModel> GetLatestSubmissions<TServiceModel>(int? limit = null)
        => this.GetQuery(
                orderBy: s => s.Id,
                descending: true,
                take: limit)
            .MapCollection<TServiceModel>();

    public async Task<PagedResult<TServiceModel>> GetLatestSubmissionsByUserParticipations<TServiceModel>(
        IEnumerable<int> userParticipantsIds,
        int submissionsPerPage,
        int pageNumber)
            => await this.GetQuery(
                    filter: s => !s.IsDeleted && userParticipantsIds.Contains(s.ParticipantId),
                    orderBy: s => s.Id,
                    descending: true)
                .MapCollection<TServiceModel>()
                .ToPagedResultAsync(submissionsPerPage, pageNumber);

    public IQueryable<Submission> GetAllByProblemAndParticipant(int problemId, int participantId)
        => this.GetQuery(
            filter: s => s.ParticipantId == participantId && s.ProblemId == problemId,
            orderBy: q => q.CreatedOn,
            descending: true);

    public IQueryable<Submission> GetAllForUserByContest(int contestId, string userId)
        => this.GetQuery(
        filter: s => s.Participant!.UserId == userId
                     && s.Problem.ProblemGroup.ContestId == contestId,
        orderBy: s => s.Id,
        descending: true);

    public async Task<int> GetUserSubmissionTimeLimit(int participantId, int limitBetweenSubmissions)
    {
        if (limitBetweenSubmissions <= 0)
        {
            return 0;
        }

        var lastSubmissionCreatedOn = await this.GetLastSubmitForParticipant(participantId);

        if (lastSubmissionCreatedOn != default)
        {
            // check if the submission was sent after the submission time limit has passed
            var differenceBetweenSubmissions = this.datesService.GetUtcNow() - lastSubmissionCreatedOn;
            // Adding 5 seconds to compensate for potential difference between server and client time
            if (differenceBetweenSubmissions.TotalSeconds + 5 < limitBetweenSubmissions)
            {
                return limitBetweenSubmissions - differenceBetweenSubmissions.TotalSeconds.ToInt();
            }
        }

        return 0;
    }

    public Task<bool> HasParticipantNotProcessedSubmissionForProblem(int problemId, int participantId)
        => this.Exists(s => s.ProblemId == problemId && s.ParticipantId == participantId && !s.Processed);

    public Task<bool> HasParticipantNotProcessedSubmissionForContest(int contestId, int participantId)
        => this.Exists(s =>
            s.Problem.ProblemGroup.ContestId == contestId &&
            s.ParticipantId == participantId && !s.Processed);

    public async Task<int> GetSubmissionsPerDayCount()
        => await this.GetQuery().AnyAsync()
            ? await this.GetQuery().GroupBy(x => new { x.CreatedOn.Year, x.CreatedOn.DayOfYear })
                .Select(x => x.Count())
                .AverageAsync()
                .ToInt()
            : 0;

    private IQueryable<Submission> GetByIdQuery(int id) =>
        this.GetQuery(s => s.Id == id);

    private async Task<DateTime> GetLastSubmitForParticipant(int participantId)
        => await this.GetQuery(s => s.ParticipantId == participantId)
            .OrderByDescending(s => s.CreatedOn)
            .Select(s => s.CreatedOn)
            .FirstOrDefaultAsync();
}