namespace OJS.Services.Ui.Data
{
    using System.Linq;
    using OJS.Data.Models.Tests;
    using OJS.Services.Common.Data;
    using SoftUni.Services.Infrastructure;

    public interface ITestsDataService : IService, IDataService<Test>
    {
        IQueryable<Test> GetByIdQuery(int id);

        IQueryable<Test> GetAllByProblem(int problemId);

        IQueryable<Test> GetAllNonTrialByProblem(int problemId);

        void DeleteByProblem(int problemId);
    }
}