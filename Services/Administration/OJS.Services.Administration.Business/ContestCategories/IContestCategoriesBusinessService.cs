namespace OJS.Services.Administration.Business.ContestCategories;

using System.Linq;
using OJS.Data.Models.Contests;
using OJS.Services.Administration.Models.ContestCategories;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IContestCategoriesBusinessService : IAdministrationOperationService<ContestCategory, int, ContestCategoryAdministrationModel>
{
    IQueryable<ContestCategory> GetAllVisible();

    Task<IEnumerable<ContestCategoriesHierarchyModel>> GetHierarchy();

    Task<IEnumerable<LecturerInContestCategoryActionsModel>> GetForLecturerInContestCategory(string userId);

    Task EditHierarchy(Dictionary<int, ContestCategoriesHierarchyEditModel> categoriesToUpdate);
}