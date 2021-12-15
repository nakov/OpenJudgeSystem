namespace OJS.Services.Administration.Data.Implementations
{
    using Microsoft.EntityFrameworkCore;
    using OJS.Data.Models.Contests;
    using OJS.Services.Common.Data.Implementations;
    using System.Linq;
    using System.Threading.Tasks;

    public class ContestCategoriesDataService : DataService<ContestCategory>, IContestCategoriesDataService
    {
        public ContestCategoriesDataService(DbContext db) : base(db)
        {
        }

        public async Task<bool> UserHasContestCategoryPermissions(int categoryId, string userId, bool isAdmin)
            => !string.IsNullOrWhiteSpace(userId) &&
               (isAdmin || await this.Exists(x =>
                   x.Id == categoryId &&
                   x.LecturersInContestCategories.Any(y => y.LecturerId == userId)));

        public IQueryable<ContestCategory> GetAllVisible() =>
            this.DbSet
                .Where(cc => cc.IsVisible);

        public IQueryable<ContestCategory> GetAllVisibleByLecturer(string lecturerId)
            => this.GetAllVisible()
                .Where(cc =>
                    cc.LecturersInContestCategories.Any(l => l.LecturerId == lecturerId) ||
                    cc.Contests.Any(c => c.LecturersInContests.Any(l => l.LecturerId == lecturerId)));

        public Task<string> GetNameById(int id)
            => this.DbSet
                .Where(cc => cc.Id == id)
                .Select(cc => cc.Name)
                .FirstOrDefaultAsync();

        public Task<bool> HasContestsById(int id)
            => this.GetAllVisible()
                .Where(cc => cc.Id == id)
                .AnyAsync(cc => cc.Contests.Any());
    }
}