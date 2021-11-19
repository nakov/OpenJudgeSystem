namespace OJS.Services.Ui.Data.Implementations
{
    using Microsoft.EntityFrameworkCore;
    using OJS.Data;
    using OJS.Data.Models.Problems;
    using OJS.Services.Common.Data.Implementations;
    using System.Threading.Tasks;

    public class ProblemsDataService : DataService<Problem>, IProblemsDataService
    {
        public ProblemsDataService(OjsDbContext db) : base(db)
        {
        }

        public Task<Problem> GetWithProblemGroupCheckerAndTestsById(int id)
            => this.DbSet
                .Include(p => p.ProblemGroup)
                .Include(p => p.Checker)
                .Include(p => p.Tests)
                .FirstOrDefaultAsync(p => p.Id == id);
    }
}