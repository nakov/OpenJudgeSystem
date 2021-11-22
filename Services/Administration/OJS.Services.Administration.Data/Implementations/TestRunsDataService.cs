using Microsoft.EntityFrameworkCore;
using OJS.Data.Models.Tests;
using OJS.Services.Common.Data.Implementations;
using System.Linq;

namespace OJS.Services.Administration.Data.Implementations
{
    public class TestRunsDataService : DataService<TestRun>, ITestRunsDataService
    {
        public TestRunsDataService(DbContext testRuns) : base(testRuns) {}

        public IQueryable<TestRun> GetAllByTest(int testId) =>
            this.DbSet
                .Where(tr => tr.TestId == testId);

        public void DeleteByProblem(int problemId) =>
            this.DbSet.RemoveRange(this.DbSet.Where(tr => tr.Submission.ProblemId == problemId));

        public void DeleteByTest(int testId) =>
            this.DbSet.RemoveRange(this.DbSet.Where(tr => tr.TestId == testId));

        public void DeleteBySubmission(int submissionId) =>
            this.DbSet.RemoveRange(this.DbSet.Where(tr => tr.SubmissionId == submissionId));
    }
}