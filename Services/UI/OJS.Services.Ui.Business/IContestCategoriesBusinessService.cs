namespace OJS.Services.Ui.Business;

using OJS.Services.Common.Models.Cache;
using SoftUni.Services.Infrastructure;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IContestCategoriesBusinessService : IService
{
    Task<IEnumerable<ContestCategoryListViewModel>> GetAllMain();

    Task<IEnumerable<ContestCategoryListViewModel>> GetAllSubcategories(int categoryId);

    Task<IEnumerable<ContestCategoryListViewModel>> GetAllParentCategories(int categoryId);
}