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
            this.DbSet
                .Where(p => p.ProblemGroup.ContestId == contestId);

        public Task<Problem?> GetWithProblemGroupById(int problemId)
            => this.GetByIdQuery(problemId)
                .Include(p => p.ProblemGroup)
                .FirstOrDefaultAsync();

        public Task<Problem?> GetWithProblemGroupCheckerAndTestsById(int id)
            => this.DbSet
                .Include(p => p.ProblemGroup)
                .Include(p => p.Checker)
                .Include(p => p.Tests)
                .Include(p => p.SubmissionTypesInProblems)
                .FirstOrDefaultAsync(p => p.Id == id);

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
            this.DbSet
                .Where(p => !p.IsDeleted);

        private IQueryable<Problem> GetAllByProblemGroup(int problemGroupId) =>
            this.DbSet
                .Where(p => p.ProblemGroupId == problemGroupId);
    }
}