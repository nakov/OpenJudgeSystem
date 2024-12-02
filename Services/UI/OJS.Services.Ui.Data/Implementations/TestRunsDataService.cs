namespace OJS.Services.Ui.Data.Implementations
{
    using OJS.Data;
    using OJS.Data.Models.Tests;
    using OJS.Services.Common.Data.Implementations;
    using System.Linq;

    public class TestRunsDataService : DataService<TestRun>, ITestRunsDataService
    {
        public TestRunsDataService(OjsDbContext testRuns)
            : base(testRuns)
        {
        }

        public IQueryable<TestRun> GetAllBySubmission(int submissionId)
            => this.GetQuery()
                .Where(tr => tr.SubmissionId == submissionId);
    }
}