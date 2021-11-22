namespace OJS.Services.Administration.Data.Implementations
{
    using Microsoft.EntityFrameworkCore;
    using OJS.Data.Models.Problems;
    using System.Linq;
    using OJS.Services.Common.Data.Implementations;

    public class ProblemResourcesDataService : DataService<ProblemResource>, IProblemResourcesDataService
    {

        public ProblemResourcesDataService(DbContext problemResources) : base(problemResources)
        {
        }

        public IQueryable<ProblemResource> GetByProblemQuery(int problemId) =>
            this.DbSet
                .Where(pr => pr.ProblemId == problemId);


        public void DeleteByProblem(int problemId) =>
            this.DbSet.RemoveRange(this.DbSet.Where(pr => pr.ProblemId == problemId));
    }
}