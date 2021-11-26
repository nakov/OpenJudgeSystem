namespace OJS.Services.Administration.Data
{
    using OJS.Data.Models.Contests;
    using OJS.Services.Common.Data;
    using System.Threading.Tasks;

    public interface IContestCategoriesDataService : IDataService<ContestCategory>
    {
        Task<bool> UserHasContestCategoryPermissions(int categoryId, string userId, bool isAdmin);
    }
}