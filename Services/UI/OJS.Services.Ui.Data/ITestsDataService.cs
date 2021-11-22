using OJS.Data.Models.Tests;
using OJS.Services.Common.Data;
using SoftUni.Services.Infrastructure;
using System.Linq;

namespace OJS.Services.Ui.Data
{
    public interface ITestsDataService : IService, IDataService<Test>
    {
        IQueryable<Test> GetByIdQuery(int id);

        IQueryable<Test> GetAllByProblem(int problemId);

        IQueryable<Test> GetAllNonTrialByProblem(int problemId);

        void DeleteByProblem(int problemId);
    }
}