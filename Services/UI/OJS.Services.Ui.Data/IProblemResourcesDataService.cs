using OJS.Data.Models.Problems;
using OJS.Services.Common.Data;
using SoftUni.Services.Infrastructure;
using System.Linq;

namespace OJS.Services.Ui.Data
{
    public interface IProblemResourcesDataService : IDataService<ProblemResource>, IService
    {
        IQueryable<ProblemResource> GetByProblemQuery(int problemId);

        void DeleteByProblem(int problemId);
    }
}