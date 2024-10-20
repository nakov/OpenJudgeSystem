namespace OJS.Services.Ui.Data.Implementations
{
    using Microsoft.EntityFrameworkCore;
    using OJS.Common;
    using OJS.Data;
    using OJS.Data.Models.Problems;
    using OJS.Services.Common.Data.Implementations;
    using System.Linq;
    using System.Threading.Tasks;

    public class ProblemsDataService : DataService<Problem>, IProblemsDataService
    {
        public ProblemsDataService(OjsDbContext db)
            : base(db)
        {
        }

        public IQueryable<Problem> GetAllByContest(int contestId) =>
            this.GetQuery(p => p.ProblemGroup.ContestId == contestId);

        public Task<Problem?> GetWithProblemGroupById(int problemId)
            => this.GetByIdQuery(problemId)
                .Include(p => p.ProblemGroup)
                .FirstOrDefaultAsync();

        public Task<Problem?> GetWithProblemGroupCheckerAndTestsById(int id)
            => this.GetByIdQuery(id)
                .Include(p => p.ProblemGroup)
                .Include(p => p.Checker)
                .Include(p => p.Tests)
                .FirstOrDefaultAsync();

        public async Task<double> GetNewOrderByContest(int contestId) =>
            (await this.GetAllByContest(contestId)
                .OrderByDescending(p => p.OrderBy)
                .Select(p => new { p.OrderBy })
                .FirstOrDefaultAsync())
                ?.OrderBy + 1 ?? GlobalConstants.ProblemDefaultOrderBy;

        public async Task<double> GetNewOrderByProblemGroup(int problemGroupId) =>
            (await this.GetAllByProblemGroup(problemGroupId)
                .OrderByDescending(p => p.OrderBy)
                .Select(p => new { p.OrderBy })
                .FirstOrDefaultAsync())
                ?.OrderBy + 1 ?? GlobalConstants.ProblemDefaultOrderBy;
        public IQueryable<Problem> GetAllNonDeletedProblems() =>
            this.GetQuery(p => !p.IsDeleted);

        private IQueryable<Problem> GetAllByProblemGroup(int problemGroupId) =>
            this.GetQuery(p => p.ProblemGroupId == problemGroupId);
    }
}