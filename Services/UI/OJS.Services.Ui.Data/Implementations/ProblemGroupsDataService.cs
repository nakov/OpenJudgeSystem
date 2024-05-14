namespace OJS.Services.Ui.Data.Implementations
{
    using Microsoft.EntityFrameworkCore;
    using OJS.Data;
    using OJS.Data.Models.Problems;
    using OJS.Services.Common.Data.Implementations;
    using System.Linq;
    using System.Threading.Tasks;

    public class ProblemGroupsDataService : DataService<ProblemGroup>, IProblemGroupsDataService
    {
        public ProblemGroupsDataService(OjsDbContext db)
            : base(db)
        {
        }

        public Task<ProblemGroup?> GetByProblem(int problemId) =>
            this.GetAll()
                .FirstOrDefaultAsync(pg => pg.Problems
                    .Any(p => p.Id == problemId));

        public IQueryable<ProblemGroup> GetByIdQuery(int id) =>
            this.GetAll()
                .Where(pg => pg.Id == id);

        public IQueryable<ProblemGroup> GetAll() => this.GetQuery();

        public IQueryable<ProblemGroup> GetAllWithDeleted() =>
            this.GetQuery().IgnoreQueryFilters();

        public IQueryable<ProblemGroup> GetAllByContest(int contestId) =>
            this.GetAll()
                .Where(pg => pg.ContestId == contestId);

        public IQueryable<Problem> GetProblemsById(int id) =>
            this.GetByIdQuery(id)
                .SelectMany(eg => eg.Problems)
                .Where(p => !p.IsDeleted);

        public Task<bool> IsFromContestByIdAndContest(int id, int contestId) =>
            this.GetByIdQuery(id)
                .AnyAsync(pg => pg.ContestId == contestId);
    }
}