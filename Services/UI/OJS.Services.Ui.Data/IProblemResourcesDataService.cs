namespace OJS.Services.Ui.Data
{
    using System.Linq;
    using OJS.Data.Models.Problems;
    using OJS.Services.Common.Data;
    using OJS.Services.Infrastructure;

    public interface IProblemResourcesDataService : IDataService<ProblemResource>, IService
    {
        IQueryable<ProblemResource> GetByProblemQuery(int problemId);

        void DeleteByProblem(int problemId);
    }
}