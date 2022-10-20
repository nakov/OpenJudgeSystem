using FluentExtensions.Extensions;
using Microsoft.EntityFrameworkCore;
using OJS.Data.Models.Tests;
using OJS.Services.Common.Data.Implementations;
using System.Linq;
using System.Threading.Tasks;

namespace OJS.Services.Administration.Data.Implementations
{
    public class TestsDataService : DataService<Test>, ITestsDataService
    {

        public TestsDataService(DbContext tests) : base(tests) {}

        public IQueryable<Test> GetByIdQuery(int id)
            => this.DbSet
                .Where(t => t.Id == id);

        public IQueryable<Test> GetAllByProblem(int problemId)
            => this.DbSet
                .Where(t => t.ProblemId == problemId);

        public IQueryable<Test> GetAllNonTrialByProblem(int problemId)
            => this.GetAllByProblem(problemId)
                .Where(t => !t.IsTrialTest);

        public async Task DeleteByProblem(int problemId)
        {
            this.Delete(t => t.ProblemId == problemId);
            await this.SaveChanges();
        }
    }
}