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

        public async Task DeleteByProblem(int problemId)
        {
            this.Delete(tr => tr.Submission.ProblemId == problemId);
            await this.SaveChanges();
        }


        public IQueryable<TestRun> GetAllBySubmission(int submissionId)
            => this.GetQuery()
                .Where(tr => tr.SubmissionId == submissionId);
    }
}