namespace OJS.Services.Administration.Data
{
    using OJS.Services.Common.Data;
    using OJS.Data.Models.Problems;
    using System.Linq;
    using System.Threading.Tasks;

    public interface IProblemsDataService : IDataService<Problem>
    {
        Problem? GetWithProblemGroupById(int id);

        Problem? GetWithContestById(int id);

        IQueryable<Problem> GetAllByContest(int contestId);

        IQueryable<Problem> GetAllByProblemGroup(int problemGroupId);

        Task<bool> ExistsById(int id);

        Task<double> GetNewOrderByContest(int contestId);

        Task<double> GetNewOrderByProblemGroup(int problemGroupId);

        string? GetNameById(int id);
    }
}