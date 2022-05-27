namespace OJS.Services.Administration.Data.Implementations
{
    using Microsoft.EntityFrameworkCore;
    using OJS.Common.Enumerations;
    using OJS.Data;
    using OJS.Data.Models.Contests;
    using OJS.Data.Models.Problems;
    using OJS.Services.Common;
    using OJS.Services.Common.Data.Implementations;
    using OJS.Services.Infrastructure;
    using SoftUni.AutoMapper.Infrastructure.Extensions;
    using SoftUni.AutoMapper.Infrastructure.Models;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Threading.Tasks;

    public class ContestsDataService : DataService<Contest>, IContestsDataService
    {
        private readonly IDatesService dates;

        public ContestsDataService(OjsDbContext db, IDatesService dates)
            : base(db)
            => this.dates = dates;

        public async Task<IEnumerable<TServiceModel>> GetAllCompetable<TServiceModel>()
            where TServiceModel : IMapFrom<Contest>
            => await this.GetAllVisibleQuery()
                .Where(c =>
                    c.StartTime <= this.dates.GetUtcNow() &&
                    c.EndTime.HasValue &&
                    c.EndTime >= this.dates.GetUtcNow())
                .MapCollection<TServiceModel>()
                .ToListAsync();

        public async Task<IEnumerable<TServiceModel>> GetAllPast<TServiceModel>()
            where TServiceModel : IMapFrom<Contest>
            => await this.GetAllVisibleQuery()
                .Where(c => c.EndTime < this.dates.GetUtcNow())
                .MapCollection<TServiceModel>()
                .ToListAsync();

        public Task<Contest?> GetByIdWithProblems(int id)
            => this.DbSet
                .Include(c => c.ProblemGroups)
                .ThenInclude(pg => pg.Problems)
                .FirstOrDefaultAsync(c => c.Id == id);

        public Task<Contest?> GetByIdWithParticipants(int id)
            => this.GetByIdQuery(id)
                .Include(c => c.Participants)
                .FirstOrDefaultAsync();

        public IQueryable<Contest> GetAllActive()
            => this.GetAllVisible()
                .Where(c =>
                    c.StartTime <= DateTime.Now &&
                    (c.EndTime >= DateTime.Now ||
                        (c.Type == ContestType.OnlinePracticalExam && c.Participants.Any(p =>
                            p.IsOfficial &&
                            p.ParticipationEndTime >= DateTime.Now))));

        public IQueryable<Contest> GetAllInactive()
            => this.DbSet
                .Where(c =>
                    c.StartTime > DateTime.Now ||
                    (c.EndTime < DateTime.Now && c.Type != ContestType.OnlinePracticalExam) ||
                    !c.Participants.Any(p => p.ParticipationEndTime < DateTime.Now));

        public IQueryable<Contest> GetAllUpcoming()
            => this.GetAllVisible()
                .Where(c => c.StartTime > DateTime.Now);

        public IQueryable<Contest> GetAllVisible()
            => this.DbSet
                .Where(c => c.IsVisible);

        public IQueryable<Contest> GetAllVisibleByCategory(int categoryId)
            => this.GetAllVisible()
                .Where(c => c.CategoryId == categoryId);

        public IQueryable<Contest> GetAllVisibleBySubmissionType(int submissionTypeId)
            => this.GetAllVisible()
                .Where(c => c.ProblemGroups
                    .SelectMany(pg => pg.Problems)
                    .Any(p => p.SubmissionTypesInProblems.Any(s => s.SubmissionTypeId == submissionTypeId)));

        public IQueryable<Contest> GetAllByLecturer(string? lecturerId)
            => this.DbSet
                .Where(c =>
                    c.LecturersInContests.Any(l => l.LecturerId == lecturerId) ||
                    c.Category!.LecturersInContestCategories.Any(l => l.LecturerId == lecturerId));

        public IQueryable<Contest> GetAllVisibleByCategoryAndLecturer(int categoryId, string? lecturerId)
            => this.GetAllByLecturer(lecturerId)
                .Where(c => c.CategoryId == categoryId);

        public IQueryable<Contest> GetAllWithDeleted() => this.DbSet.IgnoreQueryFilters();

        public Task<int> GetMaxPointsById(int id)
            => this.GetMaxPointsByIdAndProblemGroupsFilter(id, pg => true);

        public Task<int> GetMaxPointsForExportById(int id)
            => this.GetMaxPointsByIdAndProblemGroupsFilter(id, pg => pg.Type != ProblemGroupType.ExcludedFromHomework);

        public Task<string?> GetNameById(int id)
            => this.GetByIdQuery(id)
                .Select(c => c.Name)
                .FirstOrDefaultAsync();

        public async Task<bool> IsActiveById(int id)
        {
            var contest = await this.OneById(id);
            return contest != null && contest.IsActive;
        }

        public async Task<bool> IsOnlineById(int id)
            => await this.GetByIdQuery(id)
                .Select(c => c.Type)
                .FirstOrDefaultAsync() == ContestType.OnlinePracticalExam;

        public Task<bool> IsUserLecturerInByContestAndUser(int id, string? userId)
            => this.GetByIdQuery(id)
                .AnyAsync(c =>
                    c.LecturersInContests.Any(l => l.LecturerId == userId) ||
                    c.Category!.LecturersInContestCategories.Any(l => l.LecturerId == userId));

        public Task<bool> IsUserParticipantInByContestAndUser(int id, string? userId)
            => this.DbSet
                .AnyAsync(c =>
                    c.Id == id &&
                    c.Participants.Any(p => p.UserId == userId));

        public Task<bool> IsUserInExamGroupByContestAndUser(int id, string? userId)
            => this.DbSet
                .AnyAsync(c =>
                    c.Id == id &&
                    c.ExamGroups.Any(eg => eg.UsersInExamGroups.Any(u => u.UserId == userId)));

        private async Task<int> GetMaxPointsByIdAndProblemGroupsFilter(int id, Expression<Func<ProblemGroup, bool>> filter)
            => await this.GetByIdQuery(id)
                .Select(c => c.ProblemGroups
                    .AsQueryable()
                    .Where(pg => pg.Problems.Any(p => !p.IsDeleted))
                    .Where(filter)
                    .Sum(pg => (int?)pg.Problems.First().MaximumPoints))
                .FirstOrDefaultAsync() ?? default(int);

        private IQueryable<Contest> GetAllVisibleQuery()
            => this.DbSet
                .Where(c => c.IsVisible);
    }
}