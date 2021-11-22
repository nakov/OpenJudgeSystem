using OJS.Data.Models.Problems;
using SoftUni.Services.Infrastructure;
using System.Linq;

namespace OJS.Services.Ui.Data
{
    public interface IProblemResourcesDataService : IService
    {
        IQueryable<ProblemResource> GetByProblemQuery(int problemId);

        void DeleteByProblem(int problemId);
    }
}