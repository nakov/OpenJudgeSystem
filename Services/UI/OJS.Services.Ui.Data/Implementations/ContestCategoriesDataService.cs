using Microsoft.EntityFrameworkCore;
using OJS.Data;
using OJS.Data.Models.Contests;
using OJS.Services.Common.Data.Implementations;
using OJS.Services.Infrastructure.Extensions;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OJS.Services.Ui.Data.Implementations
{
    public class ContestCategoriesDataService : DataService<ContestCategory>, IContestCategoriesDataService
    {
        public ContestCategoriesDataService(OjsDbContext db)
            : base(db)
        {
        }

        public IQueryable<ContestCategory> GetAllVisible()
            => this.DbSet
                .Where(cc => cc.IsVisible);

        public Task<IEnumerable<T>> GetAllVisible<T>()
            => this.DbSet
                .Where(cc=> cc.IsVisible)
                .MapCollection<T>()
                .ToEnumerableAsync();

        public IEnumerable<T> GetAllowedStrategyTypesById<T>(int id)
            =>  this.DbSet
                    .Where(cc => cc.Id == id)
                .SelectMany(c => c.Contests)
                    .Where(pg => !pg.IsDeleted && pg.IsVisible)
                .SelectMany(pg => pg.ProblemGroups)
                    .Where(p => !p.IsDeleted)
                .SelectMany(pp => pp.Problems)
                    .Where(pp=>!pp.IsDeleted)
                .SelectMany(p => p.SubmissionTypesInProblems)
                .Select(st => st.SubmissionType)
                .MapCollection<T>()
                .ToList();

        public IQueryable<ContestCategory> GetAllVisibleByLecturer(string lecturerId)
            => this.GetAllVisible()
                .Where(cc =>
                    cc.LecturersInContestCategories.Any(l => l.LecturerId == lecturerId) ||
                    cc.Contests.Any(c => c.LecturersInContests.Any(l => l.LecturerId == lecturerId)));

        public Task<string?> GetNameById(int id)
            => this.DbSet
                .Where(cc => cc.Id == id)
                .Select(cc => cc.Name)
                .FirstOrDefaultAsync();

        public Task<bool> HasContestsById(int id)
            => this.GetAllVisible()
                .Where(cc => cc.Id == id)
                .AnyAsync(cc => cc.Contests.Any());

        public IQueryable<ContestCategory> GetAllVisibleOrdered() =>
            this.DbSet
                .Where(cc => cc.IsVisible)
                .OrderBy(x => x.OrderBy);

        public Task<IEnumerable<TServiceModel>> GetAllVisibleMainOrdered<TServiceModel>()
            => this.GetAllVisibleOrdered()
                .Where(x => !x.ParentId.HasValue)
                .MapCollection<TServiceModel>()
                .ToEnumerableAsync();
    }
}