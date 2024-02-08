namespace OJS.Services.Administration.Business.ContestCategories;

using System.Linq;
using OJS.Data.Models.Contests;
using OJS.Services.Administration.Models.ContestCategories;

public interface IContestCategoriesBusinessService : IAdministrationOperationService<ContestCategory, int, ContestCategoryAdministrationModel>
{
    IQueryable<ContestCategory> GetAllVisible();
}