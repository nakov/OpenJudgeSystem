namespace OJS.Services.Ui.Data
{
    using OJS.Data.Models.Problems;
    using OJS.Services.Common.Data;
    using System.Linq;
    using System.Threading.Tasks;

    public interface IProblemsDataService : IDataService<Problem>
    {
        Task<Problem?> GetWithProblemGroupCheckerAndTestsById(int id);

        Task<double> GetNewOrderByProblemGroup(int problemGroupId);

        Task<double> GetNewOrderByContest(int contestId);

        IQueryable<Problem> GetAllByContest(int contestId);

        Task<Problem?> GetWithProblemGroupById(int problemId);
    }
}