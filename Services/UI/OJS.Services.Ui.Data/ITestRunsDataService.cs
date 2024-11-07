namespace OJS.Services.Ui.Data
{
    using OJS.Data.Models.Tests;
    using OJS.Services.Common.Data;
    using System.Linq;
    using System.Threading.Tasks;

    public interface ITestRunsDataService : IDataService<TestRun>
    {
        Task DeleteByProblem(int problemId);

        IQueryable<TestRun> GetAllBySubmission(int submissionId);
    }
}