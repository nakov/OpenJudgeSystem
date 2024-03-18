namespace OJS.Services.Ui.Data.Implementations;

using Microsoft.EntityFrameworkCore;
using OJS.Common.Enumerations;
using OJS.Data.Models.Contests;
using OJS.Data.Models.Problems;
using OJS.Services.Common;
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
    private readonly IContestsActivityService activityService;

    public ContestsDataService(
        DbContext db,
        IDatesService dates,
        IContestsActivityService activityService)
        : base(db)
    {
        this.dates = dates;
        this.activityService = activityService;
    }

    public async Task<TServiceModel?> GetByProblemId<TServiceModel>(int id)
        => await this.DbSet
            .Include(c => c.ProblemGroups)
                .ThenInclude(pg => pg.Problems)
            .Where(c => c.ProblemGroups.Any(pg => pg.Problems.Any(p => p.Id == id)))
            .MapCollection<TServiceModel>()
            .FirstOrDefaultAsync();

    public async Task<TServiceModel?> GetWithCategoryByProblem<TServiceModel>(int problemId)
        => await this.DbSet
            .Where(c => c.ProblemGroups.Any(pg => pg.Problems.Any(p => p.Id == problemId)))
            .Include(c => c.Category)
            .MapCollection<TServiceModel>()
            .FirstOrDefaultAsync();

    public async Task<IEnumerable<TServiceModel>> GetAllCompetable<TServiceModel>()
        => await this.GetAllCompetableQuery()
            .MapCollection<TServiceModel>()
            .ToListAsync();

    public async Task<IEnumerable<TServiceModel>> GetAllPracticable<TServiceModel>()
        => await this.GetAllPracticableQuery()
            .MapCollection<TServiceModel>()
            .ToListAsync();

    public async Task<IEnumerable<TServiceModel>> GetAllExpired<TServiceModel>()
        => await this.GetAllExpiredQuery()
            .MapCollection<TServiceModel>()
            .ToListAsync();

    public IQueryable<Contest> GetAllNonDeletedContests()
            => this.DbSet
                .Where(c => c.IsVisible && !c.IsDeleted);

    public async Task<PagedResult<TServiceModel>> GetAllAsPageByFiltersAndSorting<TServiceModel>(
        ContestFiltersServiceModel model)
    {
        var contests = model.CategoryIds.Any()
            ? this.GetAllVisibleByCategories(model.CategoryIds)
            : this.GetAllVisibleQuery()
                .Include(c => c.Category);

        contests = this.FilterByStatus(contests, model.Statuses.ToList());
        contests = Sort(contests, model.SortType, model.CategoryIds.Count());

        if (model.SubmissionTypeIds.Any())
        {
            contests = contests
                .Where(ContainsSubmissionTypeIds(model.SubmissionTypeIds));
        }

        return await contests
            .MapCollection<TServiceModel>()
            .ToPagedResultAsync(model.ItemsPerPage, model.PageNumber);
    }

    public Task<Contest?> GetByIdWithProblems(int id)
        => this.DbSet
            .Include(c => c.Category)
            .Include(c => c.ProblemGroups)
                .ThenInclude(pg => pg.Problems)
            .FirstOrDefaultAsync(c => c.Id == id);

    public Task<Contest?> GetByIdWithCategoryAndProblemsAndSubmissionTypes(int id)
        => this.DbSet
            .Include(c => c.Category)
            .Include(c => c.ProblemGroups)
            .ThenInclude(pg => pg.Problems)
                .ThenInclude(p => p.SubmissionTypesInProblems)
                    .ThenInclude(stp => stp.SubmissionType)
            .FirstOrDefaultAsync(c => c.Id == id);

    public Task<Contest?> GetByIdWithProblemsDetailsAndCategories(int id)
        => this.DbSet
            .Include(c => c.Category)
            .Include(c => c.ProblemGroups)
                .ThenInclude(pg => pg.Problems)
                        .ThenInclude(p => p.Resources)
            .Include(c => c.ProblemGroups)
                 .ThenInclude(pg => pg.Problems)
                    .ThenInclude(p => p.SubmissionTypesInProblems)
                        .ThenInclude(sp => sp.SubmissionType)
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

    // After removing the sorting menu for the user, we are using OrderBy as default sorting value
    //Logic for Name, StartDate and EndDate is not used anymore therefore it is commented out
    private static IQueryable<Contest> Sort(
        IQueryable<Contest> contests,
        ContestSortType? sorting,
        int categoriesCount)
    {
        // if (sorting == ContestSortType.StartDate)
        // {
        //     return contests
        //         .OrderBy(c => c.StartTime)
        //         .ThenBy(c => c.PracticeStartTime)
        //         .ThenBy(c => c.Name);
        // }
        //
        // if (sorting == ContestSortType.EndDate)
        // {
        //     return contests
        //         .OrderBy(c => c.EndTime)
        //         .ThenBy(c => c.PracticeEndTime)
        //         .ThenBy(c => c.Name);
        // }
        //
        // if (sorting == ContestSortType.Name)
        // {
        //     return contests
        //         .OrderBy(c => c.Name)
        //         .ThenBy(c => c.StartTime)
        //         .ThenBy(c => c.PracticeStartTime);
        // }

        // By checking the number of categories we can determine if the contest is a parent or a child contest
        //based on this we display the contests differently
        // 0 categories - main contest page displays the contest which have the LEAST time left
        // 1 category - child contest and we order the by the order by property of the category
        // > 1 categories - we first order them by the Contest.Category's OrderBy and then by the Contest's OrderBy

        if (sorting == ContestSortType.OrderBy)
        {
            switch (categoriesCount)
            {
                case 0:
                    return contests
                        .OrderBy(c => c.EndTime.HasValue && c.EndTime.Value < DateTime.UtcNow ? 2 :
                            c.EndTime.HasValue ? 1 : 3)
                        .ThenBy(c => c.EndTime);

                case 1:
                    return contests
                            .OrderBy(c => c.OrderBy)
                            .ThenByDescending(c => c.EndTime)
                            .ThenByDescending(c => c.PracticeEndTime);
                default:
                    return contests
                        .OrderBy(c => c.Category == null ? int.MaxValue : c.Category.OrderBy)
                        .ThenBy(c => c.OrderBy)
                        .ThenByDescending(c => c.EndTime);
            }
        }

        return contests;
    }

    private static Expression<Func<Contest, bool>> ContainsSubmissionTypeIds(IEnumerable<int> submissionTypeIds)
        => c => c.ProblemGroups
            .SelectMany(pg => pg.Problems)
            .SelectMany(p => p.SubmissionTypesInProblems)
            .Select(x => x.SubmissionTypeId)
            .Any(x => submissionTypeIds.Contains(x)); // Does not work if converted to method group

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
            .Include(c => c.Category)
            .Include(c => c.ProblemGroups)
                .ThenInclude(pg => pg.Problems)
                    .ThenInclude(p => p.SubmissionTypesInProblems)
            .Where(c => c.CategoryId.HasValue && categoryIds.Contains(c.CategoryId.Value));

    private IQueryable<Contest> GetAllCompetableQuery()
        => this.GetAllVisibleQuery()
            .Where(this.CanBeCompeted());

    private IQueryable<Contest> GetAllExpiredQuery()
        => this.GetAllVisibleQuery()
            .Where(this.IsExpired());

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
                && (!c.EndTime.HasValue || c.EndTime >= this.dates.GetUtcNow());

    private Expression<Func<Contest, bool>> IsUpcoming()
        => c => c.StartTime > this.dates.GetUtcNow();

    private Expression<Func<Contest, bool>> IsExpired()
        => c => c.StartTime <= this.dates.GetUtcNow()
                && c.EndTime < this.dates.GetUtcNow();

    private Expression<Func<Contest, bool>> CanBePracticed()
        => c => c.PracticeStartTime <= this.dates.GetUtcNow()
                && (!c.PracticeEndTime.HasValue || c.PracticeEndTime > this.dates.GetUtcNow());

    private IQueryable<Contest> FilterByStatus(
        IQueryable<Contest> contests,
        ICollection<ContestStatus> statuses)
    {
        var active = statuses.Any(s => s == ContestStatus.Active);
        var past = statuses.Any(s => s == ContestStatus.Past);
        var upcoming = statuses.Any(s => s == ContestStatus.Upcoming);
        var practice = statuses.Any(s => s == ContestStatus.Practice);

        if (active && !past && !upcoming && !practice)
        {
            return contests.Where(this.CanBeCompeted());
        }

        if (past && !active && !upcoming && !practice)
        {
            return contests.Where(this.IsExpired());
        }

        if (upcoming && !active && !past && !practice)
        {
            return contests.Where(this.IsUpcoming());
        }

        if (practice && !active && !past && !upcoming)
        {
            return contests.Where(this.CanBePracticed());
        }

        if (active && past)
        {
            return contests
                .Where(this.CanBeCompeted())
                .Concat(contests.Where(this.IsExpired()));
        }

        return contests;
    }
}