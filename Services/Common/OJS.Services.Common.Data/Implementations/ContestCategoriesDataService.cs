namespace OJS.Services.Common.Data.Implementations;

using Microsoft.EntityFrameworkCore;
using OJS.Data.Models.Contests;
using OJS.Services.Infrastructure.Extensions;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class ContestCategoriesDataService : DataService<ContestCategory>, IContestCategoriesDataService
{
    public ContestCategoriesDataService(DbContext db) : base(db)
    {
    }

    public IQueryable<ContestCategory> GetAllVisibleOrdered() =>
        this.DbSet
            .Where(cc => cc.IsVisible)
            .OrderBy(x => x.OrderBy);

    public Task<IEnumerable<TServiceModel>> GetAllVisibleMainOrdered<TServiceModel>()
        => this.GetAllVisibleOrdered()
            .Where(x => !x.ParentId.HasValue)
            .MapCollection<TServiceModel>()
            .ToEnumerableAsync();

    public Task<string?> GetNameById(int id)
        => this.DbSet
            .Where(cc => cc.Id == id)
            .Select(cc => cc.Name)
            .FirstOrDefaultAsync();
}