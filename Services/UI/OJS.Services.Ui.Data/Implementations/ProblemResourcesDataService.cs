namespace OJS.Services.Ui.Data.Implementations
{
    using OJS.Data;
    using OJS.Data.Models.Problems;
    using OJS.Services.Common.Data.Implementations;

    public class ProblemResourcesDataService : DataService<ProblemResource>, IProblemResourcesDataService
    {
        public ProblemResourcesDataService(OjsDbContext problemResources)
            : base(problemResources)
        {
        }

        public void DeleteByProblem(int problemId) =>
            this.Delete(pr => pr.ProblemId == problemId);
    }
}