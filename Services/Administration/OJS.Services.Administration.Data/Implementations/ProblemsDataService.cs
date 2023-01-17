namespace OJS.Services.Administration.Data.Implementations
{
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.EntityFrameworkCore;
    using OJS.Common;
    using OJS.Data.Models.Problems;
    using OJS.Services.Common.Data.Implementations;

    public class ProblemsDataService : DataService<Problem>, IProblemsDataService
    {
        public ProblemsDataService(DbContext problems)
            : base(problems)
        {
        }

        public Problem? GetWithProblemGroupById(int id) =>
            this.DbSet
                .Include(p => p.ProblemGroup)
                .FirstOrDefault(p => p.Id == id);

        public Problem? GetWithContestById(int id) =>
            this.DbSet
                .Include(p => p.ProblemGroup.Contest)
                .FirstOrDefault(p => p.Id == id);

        public IQueryable<Problem> GetAllByContest(int contestId) =>
            this.DbSet
                .Where(p => p.ProblemGroup.ContestId == contestId);

        public IQueryable<Problem> GetAllByProblemGroup(int problemGroupId) =>
            this.DbSet
                .Where(p => p.ProblemGroupId == problemGroupId);

        public Task<bool> ExistsById(int id) =>
            this.DbSet
                .AnyAsync(p => p.Id == id);

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

        public string? GetNameById(int id) =>
            this.GetByIdQuery(id)
                .Select(p => p.Name)
                .FirstOrDefault();
    }
}