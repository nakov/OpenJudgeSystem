namespace OJS.Services.Ui.Data.Implementations
{
    using OJS.Data;
    using OJS.Data.Models.Tests;
    using OJS.Services.Common.Data.Implementations;
    using System.Linq;

    public class TestsDataService : DataService<Test>, ITestsDataService
    {
        public TestsDataService(OjsDbContext tests)
            : base(tests)
        {
        }

        public IQueryable<Test> GetAllByProblem(int problemId)
            => this.GetQuery(t => t.ProblemId == problemId);
    }
}