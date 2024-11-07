namespace OJS.Services.Ui.Data
{
    using System.Linq;
    using OJS.Data.Models.Tests;
    using OJS.Services.Common.Data;

    public interface ITestsDataService : IDataService<Test>
    {
        IQueryable<Test> GetAllByProblem(int problemId);
    }
}