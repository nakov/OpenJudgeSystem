using Microsoft.EntityFrameworkCore;
using OJS.Data.Models.Tests;
using OJS.Services.Common.Data.Infrastructure.Implementations;
using System.Linq;

namespace OJS.Services.Ui.Data.Implementations
{
    public class TestsDataService : DataService<Test>, ITestsDataService
    {

        public TestsDataService(DbContext tests) : base(tests) {}

        public IQueryable<Test> GetByIdQuery(int id) =>
            this.DbSet
                .Where(t => t.Id == id);

        public IQueryable<Test> GetAllByProblem(int problemId) =>
            this.DbSet
                .Where(t => t.ProblemId == problemId);

        public IQueryable<Test> GetAllNonTrialByProblem(int problemId) =>
            this.GetAllByProblem(problemId)
                .Where(t => !t.IsTrialTest);

        public void DeleteByProblem(int problemId)
        {
            var entity = this.DbSet.FirstOrDefault(t => t.ProblemId == problemId);
            this.Delete(entity);
            this.SaveChanges();
        }
    }
}