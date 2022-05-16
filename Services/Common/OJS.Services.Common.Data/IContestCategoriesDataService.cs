namespace OJS.Services.Common.Data;

using OJS.Data.Models.Contests;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public interface IContestCategoriesDataService : IDataService<ContestCategory>
{
    IQueryable<ContestCategory> GetAllVisibleOrdered();

    Task<IEnumerable<TServiceModel>> GetAllVisibleMainOrdered<TServiceModel>();

    Task<string?> GetNameById(int id);
}