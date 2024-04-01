namespace OJS.Services.Administration.Data.Implementations
{
    using Microsoft.EntityFrameworkCore;
    using OJS.Data;
    using OJS.Data.Models.Problems;
    using OJS.Services.Common.Data.Implementations;
    using System.Linq;

    public class ProblemResourcesDataService : DataService<ProblemResource>, IProblemResourcesDataService
    {
        public ProblemResourcesDataService(OjsDbContext problemResources)
            : base(problemResources)
        {
        }

        public IQueryable<ProblemResource> GetByProblemQuery(int problemId)
            => this.DbSet
                .Where(pr => pr.ProblemId == problemId && !pr.IsDeleted);

        public void DeleteByProblem(int problemId)
            => this.DbSet.RemoveRange(this.DbSet.Where(pr => pr.ProblemId == problemId));
    }
}