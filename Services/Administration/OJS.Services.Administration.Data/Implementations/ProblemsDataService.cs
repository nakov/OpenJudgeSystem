namespace OJS.Services.Administration.Data.Implementations
{
    using Microsoft.EntityFrameworkCore;
    using OJS.Common;
    using OJS.Data.Models.Problems;
    using OJS.Services.Common.Data.Implementations;
    using OJS.Services.Common.Models.Users;
    using System;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Threading.Tasks;

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

        public Problem? GetWithTestsAndProblemGroupById(int id) =>
            this.DbSet
                .Include(p => p.Tests)
                .Include(p => p.ProblemGroup)
                .FirstOrDefault(p => p.Id == id);

        public Problem? GetWithTestsSubmissionTypesAndProblemGroupById(int id) =>
            this.DbSet
                .Include(p => p.Tests)
                .Include(p => p.ProblemGroup)
                .Include(p => p.SubmissionTypesInProblems)
                    .ThenInclude(stp => stp.SubmissionType)
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

        protected override Expression<Func<Problem, bool>> GetUserFilter(UserInfoModel user)
            => problem => user.IsAdmin ||
                          problem.ProblemGroup.Contest.Category!.LecturersInContestCategories.Any(cc => cc.LecturerId == user.Id) ||
                          problem.ProblemGroup.Contest.LecturersInContests.Any(l => l.LecturerId == user.Id);
    }
}