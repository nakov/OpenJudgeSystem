namespace OJS.Services.Administration.Data.Implementations
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.EntityFrameworkCore;
    using OJS.Data.Models.Submissions;
    using OJS.Services.Common.Data.Implementations;
    using SoftUni.AutoMapper.Infrastructure.Extensions;

    public class SubmissionsDataService : DataService<Submission>, ISubmissionsDataService
    {
        public SubmissionsDataService(DbContext submissions)
            : base(submissions)
        {
        }

        public Submission? GetBestForParticipantByProblem(int participantId, int problemId)
            => this.GetAllByProblemAndParticipant(problemId, participantId)
                .Where(s => s.Processed)
                .OrderByDescending(s => s.Points)
                .ThenByDescending(s => s.Id)
                .FirstOrDefault();

        public IQueryable<Submission> GetByIdQuery(int id)
            => this.DbSet
                .Where(s => s.Id == id);

        public IQueryable<Submission> GetAllByProblem(int problemId)
            => this.DbSet.Where(s => s.ProblemId == problemId);

        public IQueryable<Submission> GetByIds(IEnumerable<int> ids)
            => this.DbSet.Where(s => ids.Contains(s.Id));

        public IQueryable<Submission> GetAllByProblemAndParticipant(int problemId, int participantId)
            => this.DbSet
                .Where(s => s.ParticipantId == participantId && s.ProblemId == problemId);

        public IQueryable<Submission> GetAllCreatedBeforeDateAndNonBestCreatedBeforeDate(
            DateTime createdBeforeDate,
            DateTime nonBestCreatedBeforeDate)
            => this.DbSet
                .Where(s => s.CreatedOn < createdBeforeDate ||
                            (s.CreatedOn < nonBestCreatedBeforeDate &&
                             s.Participant!.Scores.All(ps => ps.SubmissionId != s.Id)));

        public IQueryable<Submission> GetAllHavingPointsExceedingLimit()
            => this.DbSet
                .Where(s => s.Points > s.Problem.MaximumPoints);

        public IQueryable<int> GetIdsByProblem(int problemId)
            => this.GetAllByProblem(problemId)
                .Select(s => s.Id);

        public bool IsOfficialById(int id)
            => this.GetByIdQuery(id)
                .Any(s => s.Participant!.IsOfficial);

        public async Task SetAllToUnprocessedByProblem(int problemId)
            => await this.GetAllByProblem(problemId)
                .UpdateFromQueryAsync(s => new Submission { Processed = false });

        public void DeleteByProblem(int problemId)
            => this.DbSet.RemoveRange(this.DbSet.Where(s => s.ProblemId == problemId));

        public void RemoveTestRunsCacheByProblem(int problemId)
            => this.GetAllByProblem(problemId)
                .UpdateFromQueryAsync(s => new Submission { TestRunsCache = null });

        public async Task<IEnumerable<TServiceModel>> GetAllNonDeletedByProblemId<TServiceModel>(int problemId)
            => await this.GetAllByProblem(problemId)
                .Where(s => !s.IsDeleted)
                .MapCollection<TServiceModel>()
                .ToListAsync();

        public async Task<IEnumerable<int>> GetIdsByProblemId(int problemId)
            => await this.GetAllByProblem(problemId)
                .Select(s => s.Id)
                .ToListAsync();
    }
}