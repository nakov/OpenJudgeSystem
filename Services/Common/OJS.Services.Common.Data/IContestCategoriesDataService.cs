namespace OJS.Services.Common.Data;

using OJS.Data.Models.Contests;
using System.Linq;
using System.Threading.Tasks;

public interface IContestCategoriesDataService : IDataService<ContestCategory>
{
    IQueryable<ContestCategory> GetAllVisible();

    IQueryable<ContestCategory> GetAllVisibleMain();

    Task<string?> GetNameById(int id);
}