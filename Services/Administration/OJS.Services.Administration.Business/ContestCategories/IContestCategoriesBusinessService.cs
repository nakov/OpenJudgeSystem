namespace OJS.Services.Administration.Business.ContestCategories;

using System.Linq;
using System.Threading.Tasks;
using OJS.Data.Models.Contests;
using OJS.Services.Administration.Models.ContestCategories;

public interface IContestCategoriesBusinessService : IAdministrationOperationService<ContestCategory, ContestCategoryAdministrationModel>
{
    IQueryable<ContestCategory> GetAllVisible();
}