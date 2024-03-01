﻿namespace OJS.Services.Administration.Data.Implementations
{
    using Microsoft.EntityFrameworkCore;
    using OJS.Data.Models.Problems;
    using OJS.Services.Common.Data.Implementations;
    using OJS.Services.Common.Models.Users;
    using System;
    using System.Linq;
    using System.Linq.Expressions;

    public class ProblemGroupsDataService : DataService<ProblemGroup>, IProblemGroupsDataService
    {
        public ProblemGroupsDataService(DbContext problemGroups)
            : base(problemGroups)
        {
        }

        public ProblemGroup? GetByProblem(int problemId) =>
            this.DbSet
                .Include(p => p.Contest)
                .Include(p => p.Problems)
                .FirstOrDefault(pg => pg.Problems
                    .Any(p => p.Id == problemId));

        public IQueryable<ProblemGroup> GetAllWithDeleted() =>
            this.DbSet.Where(pg => pg.IsDeleted == true);

        public IQueryable<ProblemGroup> GetAllByContest(int contestId) =>
            this.DbSet
                .Where(pg => pg.ContestId == contestId);

        public IQueryable<ProblemGroup> GetAllByContestId(int contestId)
            => this.GetAllByContest(contestId)
                .Where(pg => !pg.IsDeleted);

        public IQueryable<Problem> GetProblemsById(int id) =>
            this.GetByIdQuery(id)
                .SelectMany(eg => eg.Problems)
                .Where(p => !p.IsDeleted);

        public bool IsFromContestByIdAndContest(int id, int contestId) =>
            this.GetByIdQuery(id)
                .Any(pg => pg.ContestId == contestId);
        protected override Expression<Func<ProblemGroup, bool>> GetUserFilter(UserInfoModel user)
            => problemGroup => user.IsAdmin ||
                               problemGroup.Contest!.Category!.LecturersInContestCategories.Any(cc => cc.LecturerId == user.Id) ||
                               problemGroup.Contest.LecturersInContests.Any(l => l.LecturerId == user.Id);
    }
}