namespace OJS.Services.Ui.Data.Implementations
{
    using Microsoft.EntityFrameworkCore;
    using OJS.Common.Enumerations;
    using OJS.Data;
    using OJS.Data.Models.Contests;
    using OJS.Data.Models.Problems;
    using OJS.Services.Common.Data.Implementations;
    using OJS.Services.Infrastructure;
    using OJS.Services.Ui.Models.Contests;
    using SoftUni.AutoMapper.Infrastructure.Extensions;
    using SoftUni.Common.Extensions;
    using SoftUni.Common.Models;
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
            => await this.GetAllCompetableQuery()
                .MapCollection<TServiceModel>()
                .ToListAsync();

        public async Task<IEnumerable<TServiceModel>> GetAllPracticable<TServiceModel>()
            => await this.GetAllPracticableQuery()
                .MapCollection<TServiceModel>()
                .ToListAsync();

        public async Task<PagedResult<TServiceModel>> GetAllAsPageByFiltersAndSorting<TServiceModel>(
            ContestFiltersServiceModel model)
        {
            var contests = model.CategoryIds.Any()
                ? this.GetAllVisibleByCategories(model.CategoryIds)
                : this.GetAllVisibleQuery();

            contests = this.FilterByStatus(contests, model.Statuses.ToList());
            contests = this.Sort(contests, model.SortType);

            if (model.SubmissionTypeIds.Any())
            {
                contests = contests
                    .Where(this.ContainsSubmissionTypeIds(model.SubmissionTypeIds));
            }

            return await contests
                .MapCollection<TServiceModel>()
                .ToPagedResultAsync(model.ItemsPerPage, model.PageNumber);
        }

        public Task<Contest?> GetByIdWithProblems(int id)
            => this.DbSet
                .Include(c => c.ProblemGroups)
                .ThenInclude(pg => pg.Problems)
                .FirstOrDefaultAsync(c => c.Id == id);

        public Task<Contest?> GetByIdWithProblemsAndSubmissionTypes(int id)
            => this.DbSet
                .Include(c => c.ProblemGroups)
                .ThenInclude(pg => pg.Problems)
                .ThenInclude(p => p.SubmissionTypesInProblems)
                .FirstOrDefaultAsync(c => c.Id == id);

        public Task<Contest?> GetByIdWithParticipants(int id)
            => this.GetByIdQuery(id)
                .Include(c => c.Participants)
                .FirstOrDefaultAsync();

        public IQueryable<Contest> GetAllActive()
            => this.GetAllVisibleQuery()
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
            => this.GetAllVisibleQuery()
                .Where(c => c.StartTime > DateTime.Now);

        public IQueryable<Contest> GetAllVisibleBySubmissionType(int submissionTypeId)
            => this.GetAllVisibleQuery()
                .Where(c => c.ProblemGroups
                    .SelectMany(pg => pg.Problems)
                    .Any(p => p.SubmissionTypesInProblems.Any(s => s.SubmissionTypeId == submissionTypeId)));

        public IQueryable<Contest> GetAllByLecturer(string lecturerId)
            => this.DbSet
                .Where(c =>
                    c.LecturersInContests.Any(l => l.LecturerId == lecturerId) ||
                    c.Category!.LecturersInContestCategories.Any(l => l.LecturerId == lecturerId));

        public IQueryable<Contest> GetAllVisibleByCategoryAndLecturer(int categoryId, string lecturerId)
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

        public Task<bool> IsUserLecturerInByContestAndUser(int id, string userId)
            => this.GetByIdQuery(id)
                .AnyAsync(c =>
                    c.LecturersInContests.Any(l => l.LecturerId == userId) ||
                    c.Category!.LecturersInContestCategories.Any(l => l.LecturerId == userId));

        public Task<bool> IsUserParticipantInByContestAndUser(int id, string userId)
            => this.DbSet
                .AnyAsync(c =>
                    c.Id == id &&
                    c.Participants.Any(p => p.UserId == userId));

        public Task<bool> IsUserInExamGroupByContestAndUser(int id, string userId)
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

        private IQueryable<Contest> GetAllVisibleByCategories(IEnumerable<int> categoryIds)
            => this.GetAllVisibleQuery()
                .Where(c => c.CategoryId.HasValue && categoryIds.Contains(c.CategoryId.Value));

        private IQueryable<Contest> GetAllCompetableQuery()
            => this.GetAllVisibleQuery()
                .Where(this.CanBeCompeted());

        private IQueryable<Contest> GetAllPracticableQuery()
            => this.GetAllVisibleQuery()
                .Where(this.CanBePracticed());

        private IQueryable<Contest> GetAllPracticableAndCompetableQuery()
            => this.GetAllCompetableQuery()
                .Concat(this.GetAllPracticableQuery());

        private IQueryable<Contest> GetAllVisibleQuery()
            => this.DbSet
                .Where(c => c.IsVisible);

        private Expression<Func<Contest, bool>> CanBeCompeted()
            => c => c.StartTime <= this.dates.GetUtcNow()
                && (!c.EndTime.HasValue || c.EndTime > this.dates.GetUtcNow());

        private Expression<Func<Contest, bool>> CanBePracticed()
            => c => c.PracticeStartTime <= this.dates.GetUtcNow()
                && (!c.PracticeEndTime.HasValue || c.PracticeEndTime > this.dates.GetUtcNow());

        private Expression<Func<Contest, bool>> ContainsSubmissionTypeIds(IEnumerable<int> submissionTypeIds)
            => c => c.ProblemGroups
                .SelectMany(pg => pg.Problems)
                .SelectMany(p => p.SubmissionTypesInProblems)
                .Select(x => x.SubmissionTypeId)
                .Any(x => submissionTypeIds.Contains(x)); // Does not work if converted to method group

        private IQueryable<Contest> Sort(
            IQueryable<Contest> contests,
            ContestSortType? sorting)
        {
            if (sorting == ContestSortType.StartDate)
            {
                return contests
                    .OrderBy(c => c.StartTime)
                    .ThenBy(c => c.PracticeStartTime)
                    .ThenBy(c => c.Name);
            }

            if (sorting == ContestSortType.EndDate)
            {
                return contests
                    .OrderBy(c => c.EndTime)
                    .ThenBy(c => c.PracticeEndTime)
                    .ThenBy(c => c.Name);
            }

            if (sorting == ContestSortType.Name)
            {
                return contests
                    .OrderBy(c => c.Name)
                    .ThenBy(c => c.StartTime)
                    .ThenBy(c => c.PracticeStartTime);
            }

            return contests;
        }

        private IQueryable<Contest> FilterByStatus(
            IQueryable<Contest> contests,
            ICollection<ContestStatus> statuses)
        {
            var competable = statuses.Any(s => s == ContestStatus.Active);
            var practicable = statuses.Any(s => s == ContestStatus.Past);

            if (competable && !practicable)
            {
                return contests.Where(this.CanBeCompeted());
            }

            if (!competable && practicable)
            {
                return contests.Where(this.CanBePracticed());
            }

            if (competable && practicable)
            {
                return contests
                    .Where(this.CanBeCompeted())
                    .Concat(contests.Where(this.CanBePracticed()));
            }

            return contests;
        }
    }
}