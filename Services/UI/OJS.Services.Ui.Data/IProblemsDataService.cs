namespace OJS.Services.Ui.Data
{
    using OJS.Data.Models.Problems;
    using OJS.Services.Common.Data;
    using System.Linq;
    using System.Threading.Tasks;

    public interface IProblemsDataService : IDataService<Problem>
    {
        Task<Problem?> GetWithSubmissionTypesById(int id);

        Task<double> GetNewOrderByProblemGroup(int problemGroupId);

        Task<double> GetNewOrderByContest(int contestId);

        IQueryable<Problem> GetAllByContest(int contestId);

        IQueryable<Problem> GetAllNonDeletedProblems();

        Task<Problem?> GetWithProblemGroupById(int problemId);
    }
}