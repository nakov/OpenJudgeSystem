namespace OJS.Services.Ui.Business;

using OJS.Services.Common.Models.Cache;
using OJS.Services.Infrastructure;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IContestCategoriesBusinessService : IService
{
    Task<IEnumerable<ContestCategoryTreeViewModel>> GetTree();

    Task<IEnumerable<ContestCategoryListViewModel>> GetAllMain();

    Task<IEnumerable<ContestCategoryTreeViewModel>> GetAllSubcategories(int categoryId);

    Task<IEnumerable<ContestCategoryListViewModel>> GetAllParentCategories(int categoryId);

    bool IsCategoryChildOfInvisibleParentRecursive(int? categoryId);
}