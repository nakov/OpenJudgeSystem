namespace OJS.Services.Administration.Data.Implementations
{
    using OJS.Common;
    using OJS.Data.Models.Problems;
    using OJS.Services.Common.Data.Implementations;
    using System.Linq;
    using Microsoft.EntityFrameworkCore;

    public class ProblemsDataService : DataService<Problem>, IProblemsDataService
    {
        public ProblemsDataService(DbContext problems) : base(problems) {}

        public Problem GetWithProblemGroupById(int id) =>
            base.DbSet
                .Include(p => p.ProblemGroup)
                .FirstOrDefault(p => p.Id == id);

        public Problem GetWithContestById(int id) =>
            base.DbSet
                .Include(p => p.ProblemGroup.Contest)
                .FirstOrDefault(p => p.Id == id);

        public IQueryable<Problem> GetAllByContest(int contestId) =>
            base.DbSet
                .Where(p => p.ProblemGroup.ContestId == contestId);

        public IQueryable<Problem> GetAllByProblemGroup(int problemGroupId) =>
            base.DbSet
                .Where(p => p.ProblemGroupId == problemGroupId);

        public bool ExistsById(int id) =>
            base.DbSet
                .Any(p => p.Id == id);

        public double GetNewOrderByContest(int contestId) =>
            this.GetAllByContest(contestId)
                .OrderByDescending(p => p.OrderBy)
                .Select(p => new { p.OrderBy })
                .FirstOrDefault()
                ?.OrderBy + 1 ?? GlobalConstants.ProblemDefaultOrderBy;

        public double GetNewOrderByProblemGroup(int problemGroupId) =>
            this.GetAllByProblemGroup(problemGroupId)
                .OrderByDescending(p => p.OrderBy)
                .Select(p => new { p.OrderBy })
                .FirstOrDefault()
                ?.OrderBy + 1 ?? GlobalConstants.ProblemDefaultOrderBy;

        public string GetNameById(int id) =>
            this.GetByIdQuery(id)
                .Select(p => p.Name)
                .FirstOrDefault();
    }
}