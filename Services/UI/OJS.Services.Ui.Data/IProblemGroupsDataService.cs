namespace OJS.Services.Ui.Data
{
    using OJS.Data.Models.Problems;
    using OJS.Services.Common.Data;
    using System.Linq;
    using System.Threading.Tasks;

    public interface IProblemGroupsDataService : IDataService<ProblemGroup>
    {
        Task<ProblemGroup> GetByProblem(int problemId);

        IQueryable<ProblemGroup> GetByIdQuery(int id);

        IQueryable<ProblemGroup> GetAll();

        IQueryable<ProblemGroup> GetAllWithDeleted();

        IQueryable<ProblemGroup> GetAllByContest(int contestId);

        IQueryable<Problem> GetProblemsById(int id);

        Task<bool> IsFromContestByIdAndContest(int id, int contestId);
    }
}