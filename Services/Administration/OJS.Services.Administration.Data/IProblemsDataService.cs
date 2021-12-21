namespace OJS.Services.Administration.Data
{
    using OJS.Services.Common.Data;
    using OJS.Data.Models.Problems;
    using System.Linq;

    public interface IProblemsDataService : IDataService<Problem>
    {
        Problem? GetWithProblemGroupById(int id);

        Problem? GetWithContestById(int id);

        IQueryable<Problem> GetAllByContest(int contestId);

        IQueryable<Problem> GetAllByProblemGroup(int problemGroupId);

        bool ExistsById(int id);

        double GetNewOrderByContest(int contestId);

        double GetNewOrderByProblemGroup(int problemGroupId);

        string? GetNameById(int id);
    }
}