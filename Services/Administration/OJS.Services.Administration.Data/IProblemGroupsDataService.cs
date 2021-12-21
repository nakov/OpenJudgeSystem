namespace OJS.Services.Administration.Data
{
    using OJS.Data.Models.Problems;
    using SoftUni.Services.Infrastructure;
    using System.Linq;


    public interface IProblemGroupsDataService : IService
    {
        ProblemGroup? GetByProblem(int problemId);

        IQueryable<ProblemGroup> GetAllWithDeleted();

        IQueryable<ProblemGroup> GetAllByContest(int contestId);

        IQueryable<Problem> GetProblemsById(int id);

        bool IsFromContestByIdAndContest(int id, int contestId);
    }
}