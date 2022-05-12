namespace OJS.Services.Common.Data.Implementations;

using Microsoft.EntityFrameworkCore;
using OJS.Data.Models.Contests;
using System.Linq;
using System.Threading.Tasks;

public class ContestCategoriesDataService : DataService<ContestCategory>, IContestCategoriesDataService
{
    public ContestCategoriesDataService(DbContext db) : base(db)
    {
    }

    public IQueryable<ContestCategory> GetAllVisible() =>
        this.DbSet
            .Where(cc => cc.IsVisible);

    public IQueryable<ContestCategory> GetAllVisibleMain()
        => this.GetAllVisible()
            .Where(x => !x.ParentId.HasValue);

    public Task<string?> GetNameById(int id)
        => this.DbSet
            .Where(cc => cc.Id == id)
            .Select(cc => cc.Name)
            .FirstOrDefaultAsync();
}