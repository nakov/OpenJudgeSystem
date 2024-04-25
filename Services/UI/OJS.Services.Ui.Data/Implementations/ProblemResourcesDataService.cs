namespace OJS.Services.Ui.Data.Implementations
{
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

        public IQueryable<ProblemResource> GetByProblemQuery(int problemId) =>
            this.GetQuery()
                .Where(pr => pr.ProblemId == problemId);

        public void DeleteByProblem(int problemId) =>
            this.Delete(pr => pr.ProblemId == problemId);
    }
}