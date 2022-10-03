namespace OJS.Services.Administration.Data
{
    using OJS.Data.Models.Problems;
    using OJS.Services.Common.Data;
    using System.Linq;

    public interface IProblemResourcesDataService : IDataService<ProblemResource>
    {
        IQueryable<ProblemResource> GetByProblemQuery(int problemId);

        void DeleteByProblem(int problemId);
    }
}