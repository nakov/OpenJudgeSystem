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
    }
}