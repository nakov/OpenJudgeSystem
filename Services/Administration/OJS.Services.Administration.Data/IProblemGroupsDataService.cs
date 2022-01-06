namespace OJS.Services.Administration.Data
{
    using OJS.Data.Models.Problems;
    using OJS.Services.Common.Data;
    using System.Linq;

    public interface IProblemGroupsDataService : IDataService<ProblemGroup>
    {
        ProblemGroup? GetByProblem(int problemId);

        IQueryable<ProblemGroup> GetAllWithDeleted();

        IQueryable<ProblemGroup> GetAllByContest(int contestId);

        IQueryable<Problem> GetProblemsById(int id);

        bool IsFromContestByIdAndContest(int id, int contestId);
    }
}