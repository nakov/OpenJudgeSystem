using OJS.Services.Common.Data;

namespace OJS.Services.Administration.Data
{
    using OJS.Data.Models.Problems;
    using SoftUni.Services.Infrastructure;
    using System.Linq;

    public interface IProblemsDataService : IDataService<Problem>
    {
        Problem GetWithProblemGroupById(int id);

        Problem GetWithContestById(int id);

        IQueryable<Problem> GetAllByContest(int contestId);

        IQueryable<Problem> GetAllByProblemGroup(int problemGroupId);

        bool ExistsById(int id);

        int GetNewOrderByContest(int contestId);

        int GetNewOrderByProblemGroup(int problemGroupId);

        string GetNameById(int id);
    }
}