namespace OJS.Services.Administration.Data
{
    using OJS.Data.Models.Problems;
    using SoftUni.Services.Infrastructure;
    using System.Linq;

    public interface IProblemResourcesDataService : IService
    {
        IQueryable<ProblemResource> GetByProblemQuery(int problemId);

        void DeleteByProblem(int problemId);
    }
}