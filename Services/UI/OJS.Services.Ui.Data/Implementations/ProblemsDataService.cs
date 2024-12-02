namespace OJS.Services.Ui.Data.Implementations
{
    using Microsoft.EntityFrameworkCore;
    using OJS.Data;
    using OJS.Data.Models.Problems;
    using OJS.Services.Common.Data.Implementations;
    using System.Linq;
    using System.Threading.Tasks;

    public class ProblemsDataService : DataService<Problem>, IProblemsDataService
    {
        public ProblemsDataService(OjsDbContext db)
            : base(db)
        {
        }

        public Task<Problem?> GetWithProblemGroupById(int problemId)
            => this.GetByIdQuery(problemId)
                .Include(p => p.ProblemGroup)
                .FirstOrDefaultAsync();

        public IQueryable<Problem> GetAllByContest(int contestId) =>
            this.GetQuery(p => p.ProblemGroup.ContestId == contestId);

        public IQueryable<Problem> GetAllNonDeletedProblems() =>
            this.GetQuery(p => !p.IsDeleted);
    }
}