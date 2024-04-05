namespace OJS.Services.Ui.Data.Implementations
{
    using OJS.Data;
    using OJS.Data.Models.Tests;
    using OJS.Services.Common.Data.Implementations;
    using System.Linq;
    using System.Threading.Tasks;

    public class TestsDataService : DataService<Test>, ITestsDataService
    {
        public TestsDataService(OjsDbContext tests)
            : base(tests)
        {
        }

        public IQueryable<Test> GetByIdQuery(int id)
            => this.DbSet
                .Where(t => t.Id == id);

        public IQueryable<Test> GetAllByProblem(int problemId)
            => this.DbSet
                .Where(t => t.ProblemId == problemId);

        public IQueryable<Test> GetAllNonTrialByProblem(int problemId)
            => this.GetAllByProblem(problemId)
                .Where(t => !t.IsTrialTest);

        public void DeleteByProblem(int problemId)
        {
            var entity = this.DbSet.First(t => t.ProblemId == problemId);
            this.Delete(entity);
            Task.FromResult(this.SaveChanges());
        }
    }
}