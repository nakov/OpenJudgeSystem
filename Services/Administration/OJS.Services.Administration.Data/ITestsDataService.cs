namespace OJS.Services.Administration.Data
{
    using System.Linq;
    using System.Threading.Tasks;
    using OJS.Data.Models.Tests;
    using OJS.Services.Common.Data;

    public interface ITestsDataService : IDataService<Test>
    {
        IQueryable<Test> GetByIdQuery(int id);

        IQueryable<Test> GetAllByProblem(int problemId);

        IQueryable<Test> GetAllNonTrialByProblem(int problemId);

        Task DeleteByProblem(int problemId);
    }
}