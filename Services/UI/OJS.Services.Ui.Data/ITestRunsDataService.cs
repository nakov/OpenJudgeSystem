namespace OJS.Services.Ui.Data
{
    using OJS.Data.Models.Tests;
    using OJS.Services.Common.Data;
    using System.Linq;
    using System.Threading.Tasks;

    public interface ITestRunsDataService : IDataService<TestRun>
    {
        IQueryable<TestRun> GetAllByTest(int testId);

        Task DeleteByProblem(int problemId);

        Task DeleteByTest(int testId);

        Task DeleteBySubmission(int submissionId);
    }
}