namespace OJS.Services.Ui.Data
{
    using OJS.Data.Models.Tests;
    using OJS.Services.Common.Data;
    using System.Linq;

    public interface ITestRunsDataService : IDataService<TestRun>
    {
        IQueryable<TestRun> GetAllBySubmission(int submissionId);
    }
}