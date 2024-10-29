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

        IQueryable<ProblemGroup> GetAllByContestId(int contestId);

        IQueryable<Problem> GetProblemsById(int id);

        ProblemGroup? GetLastNonDeletedByContest(int contestId);

        bool IsFromContestByIdAndContest(int id, int contestId);
    }
}