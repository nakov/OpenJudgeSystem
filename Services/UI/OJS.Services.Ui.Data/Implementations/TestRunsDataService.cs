namespace OJS.Services.Ui.Data.Implementations
{
    using OJS.Data;
    using OJS.Data.Models.Tests;
    using OJS.Services.Common.Data.Implementations;
    using System.Linq;
    using System.Threading.Tasks;

    public class TestRunsDataService : DataService<TestRun>, ITestRunsDataService
    {
        public TestRunsDataService(OjsDbContext testRuns)
            : base(testRuns)
        {
        }

        public IQueryable<TestRun> GetAllByTest(int testId) =>
            this.GetQuery(tr => tr.TestId == testId);

        public async Task DeleteByProblem(int problemId)
        {
            this.Delete(tr => tr.Submission.ProblemId == problemId);
            await this.SaveChanges();
        }

        public async Task DeleteByTest(int testId)
        {
            this.Delete(tr => tr.TestId == testId);
            await this.SaveChanges();
        }

        public async Task DeleteBySubmission(int submissionId)
        {
            this.Delete(tr => tr.SubmissionId == submissionId);
            await this.SaveChanges();
        }
    }
}