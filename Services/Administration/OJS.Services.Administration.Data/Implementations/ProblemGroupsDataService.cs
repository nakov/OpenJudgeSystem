namespace OJS.Services.Administration.Data.Implementations
{
    using Microsoft.EntityFrameworkCore;
    using OJS.Data;
    using OJS.Data.Models.Problems;
    using OJS.Services.Common.Models.Users;
    using System;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Threading.Tasks;

    public class ProblemGroupsDataService : AdministrationDataService<ProblemGroup>, IProblemGroupsDataService
    {
        public ProblemGroupsDataService(OjsDbContext problemGroups)
            : base(problemGroups)
        {
        }

        public IQueryable<ProblemGroup> GetAllByContest(int contestId) =>
            this.GetQuery(pg => pg.ContestId == contestId);

        public IQueryable<ProblemGroup> GetAllByContestId(int contestId)
            => this.GetAllByContest(contestId)
                .Where(pg => !pg.IsDeleted);

        public Task<double> GetLastNonDeletedByContest(int contestId)
            => this.GetAllByContest(contestId)
                .Where(pg => !pg.IsDeleted)
                .OrderByDescending(pg => pg.OrderBy)
                .Select(pg => pg.OrderBy)
                .FirstOrDefaultAsync();

        protected override Expression<Func<ProblemGroup, bool>> GetUserFilter(UserInfoModel user)
            => problemGroup => user.IsAdmin ||
                               problemGroup.Contest!.Category!.LecturersInContestCategories.Any(cc => cc.LecturerId == user.Id) ||
                               problemGroup.Contest.LecturersInContests.Any(l => l.LecturerId == user.Id);
    }
}