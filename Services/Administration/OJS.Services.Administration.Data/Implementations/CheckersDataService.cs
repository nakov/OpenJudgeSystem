namespace OJS.Services.Administration.Data.Implementations;

using Microsoft.EntityFrameworkCore;
using OJS.Data;
using OJS.Data.Models.Checkers;
using OJS.Services.Common.Data.Implementations;
using System.Linq;
using System.Threading.Tasks;

public class CheckersDataService : DataService<Checker>, ICheckersDataService
{
    public CheckersDataService(OjsDbContext db)
        : base(db)
    {
    }

    public Task<Checker?> GetByName(string name)
        => this.DbSet
            .FirstOrDefaultAsync(ch => ch.Name == name);

    public IQueryable<Checker> GetAll()
        => this.DbSet;
}