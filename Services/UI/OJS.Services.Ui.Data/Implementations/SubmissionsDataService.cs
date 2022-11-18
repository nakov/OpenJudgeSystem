using FluentExtensions.Extensions;
using NPOI.SS.Formula.Functions;

namespace OJS.Services.Ui.Data.Implementations;

using Microsoft.EntityFrameworkCore;
using OJS.Common.Extensions;
using OJS.Data.Models.Submissions;
using OJS.Services.Common.Data.Implementations;
using OJS.Services.Infrastructure.Extensions;
using OJS.Services.Ui.Models.Submissions;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class SubmissionsDataService : DataService<Submission>, ISubmissionsDataService
{
    public SubmissionsDataService(DbContext db) : base(db)
    {
    }

    public Task<IEnumerable<TServiceModel>> GetLatestSubmissions<TServiceModel>(int count)
        => this.GetQuery(
                orderBy: s => s.Id,
                descending: true,
                take: count)
            .MapCollection<TServiceModel>()
            .ToEnumerableAsync();

    public Submission? GetBestForParticipantByProblem(int participantId, int problemId) =>
        this.GetAllByProblemAndParticipant(problemId, participantId)
            .Where(s => s.Processed)
            .OrderByDescending(s => s.Points)
            .ThenByDescending(s => s.Id)
            .FirstOrDefault();


    public IQueryable<Submission> GetAllByProblem(int problemId)
        => base.DbSet.Where(s => s.ProblemId == problemId);

    public IQueryable<Submission> GetAllByProblemAndParticipant(int problemId, int participantId) =>
        this.GetQuery(
            filter: s => s.ParticipantId == participantId && s.ProblemId == problemId,
            orderBy: q => q.CreatedOn,
            descending: true);

    public Task<IEnumerable<TServiceModel>> GetAllByProblemAndUser<TServiceModel>(int problemId, string userId,
        int? take = Constants.Submissions.DefaultCount)
        => this.GetQuery(
                filter: s => s.ProblemId == problemId && s.Participant.UserId == userId,
                take: take)
            .MapCollection<TServiceModel>()
            .ToEnumerableAsync();

    public Task<IEnumerable<TServiceModel>> GetAllFromContestsByLecturer<TServiceModel>(string lecturerId) =>
        this.DbSet
            .Where(s =>
                (s.IsPublic.HasValue && s.IsPublic.Value) ||
                s.Problem!.ProblemGroup.Contest.LecturersInContests.Any(l => l.LecturerId == lecturerId) ||
                s.Problem!.ProblemGroup!.Contest!.Category!.LecturersInContestCategories.Any(l =>
                    l.LecturerId == lecturerId))
            .MapCollection<TServiceModel>()
            .ToEnumerableAsync();

    public Task<IEnumerable<TServiceModel>> GetAllCreatedBeforeDateAndNonBestCreatedBeforeDate<TServiceModel>(
        DateTime createdBeforeDate,
        DateTime nonBestCreatedBeforeDate) =>
        this.DbSet
            .Where(s => s.CreatedOn < createdBeforeDate ||
                        (s.CreatedOn < nonBestCreatedBeforeDate &&
                         s.Participant!.Scores.All(ps => ps.SubmissionId != s.Id)))
            .MapCollection<TServiceModel>()
            .ToEnumerableAsync();

    public IQueryable<Submission> GetAllHavingPointsExceedingLimit()
        => this.DbSet
            .Where(s => s.Points > s.Problem!.MaximumPoints);

    public Task<IEnumerable<int>> GetIdsByProblem(int problemId)
        => this.GetAllByProblem(problemId)
            .Select(s => s.Id)
            .ToEnumerableAsync();

    public Task<IEnumerable<TServiceModel>> GetAllByIdsQuery<TServiceModel>(IEnumerable<int> ids)
        => this.GetQuery()
            .Where(s => ids.Contains(s.Id))
            .MapCollection<TServiceModel>()
            .ToEnumerableAsync();

    public bool IsOfficialById(int id) =>
        this.GetByIdQuery(id)
            .Any(s => s.Participant!.IsOfficial);

    public void SetAllToUnprocessedByProblem(int problemId) =>
        this.GetAllByProblem(problemId)
            .UpdateFromQueryAsync(s => new Submission { Processed = false });

    public void DeleteByProblem(int problemId) =>
        this.DbSet.RemoveRange(this.DbSet.Where(s => s.ProblemId == problemId));

    public void RemoveTestRunsCacheByProblem(int problemId) =>
        this.GetAllByProblem(problemId)
            .UpdateFromQueryAsync(s => new Submission { TestRunsCache = null });

    public bool HasSubmissionTimeLimitPassedForParticipant(int participantId, int limitBetweenSubmissions)
    {
        var lastSubmission =
            this.DbSet
                .Where(s => s.ParticipantId == participantId)
                .OrderByDescending(s => s.CreatedOn)
                .Select(s => new { s.Id, s.CreatedOn })
                .FirstOrDefault();

        if (lastSubmission != null)
        {
            // check if the submission was sent after the submission time limit has passed
            var latestSubmissionTime = lastSubmission.CreatedOn;
            var differenceBetweenSubmissions = DateTime.Now - latestSubmissionTime;
            if (differenceBetweenSubmissions.TotalSeconds < limitBetweenSubmissions)
            {
                return true;
            }
        }

        return false;
    }

    public bool HasUserNotProcessedSubmissionForProblem(int problemId, string userId) =>
        this.DbSet.Any(s => s.ProblemId == problemId && s.Participant!.UserId == userId && !s.Processed);

    public async Task<int> GetSubmissionsPerDayCount()
        => await this.DbSet.AnyAsync()
            ? await this.DbSet.GroupBy(x => new { x.CreatedOn.Year, x.CreatedOn.DayOfYear })
                .Select(x => x.Count())
                .AverageAsync()
                .ToInt()
            : 0;

    private IQueryable<Submission> GetByIdQuery(int id) =>
        this.DbSet
            .Where(s => s.Id == id);
}