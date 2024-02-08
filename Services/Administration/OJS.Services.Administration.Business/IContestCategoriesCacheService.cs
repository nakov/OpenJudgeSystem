namespace OJS.Services.Administration.Business;

using OJS.Data.Models.Contests;
using OJS.Services.Administration.Models.ContestCategories;
using SoftUni.Services.Infrastructure;
using System.Threading.Tasks;

public interface IContestCategoriesCacheService : IAdministrationOperationService<ContestCategory, ContestCategoryAdministrationModel>, IService
{
    void ClearMainContestCategoriesCache();

    Task ClearContestCategory(int categoryId);
}