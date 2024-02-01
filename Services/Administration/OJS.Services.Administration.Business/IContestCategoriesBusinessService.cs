namespace OJS.Services.Administration.Business;

using System.Linq;
using OJS.Services.Administration.Models.ContestCategories;
using System.Threading.Tasks;
using OJS.Data.Models.Contests;
using OJS.Services.Common.Data.Pagination;
using SoftUni.Services.Infrastructure;

public interface IContestCategoriesBusinessService : IGridDataService<ContestCategory>, IService
{
    IQueryable<ContestCategory> GetAllVisible();

    Task Create(ContestCategoryAdministrationModel model);

    Task<ContestCategoryAdministrationModel> GetById(int id);

    Task Edit(ContestCategoryAdministrationModel model, int id);
}