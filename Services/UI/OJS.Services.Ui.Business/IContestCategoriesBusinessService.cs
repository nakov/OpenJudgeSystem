namespace OJS.Services.Ui.Business;

using OJS.Services.Common.Models.Cache;
using SoftUni.Services.Infrastructure;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IContestCategoriesBusinessService : IService
{
    Task<IEnumerable<CategoryMenuItemViewModel>> GetAllMain();

    Task<IEnumerable<ContestCategoryListViewModel>> GetAllByParent(int parentCategoryId);
}