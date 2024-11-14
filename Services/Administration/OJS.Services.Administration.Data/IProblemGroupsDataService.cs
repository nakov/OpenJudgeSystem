namespace OJS.Services.Administration.Data
{
    using OJS.Data.Models.Problems;
    using OJS.Services.Common.Data;
    using System.Linq;
    using System.Threading.Tasks;

    public interface IProblemGroupsDataService : IDataService<ProblemGroup>
    {
        IQueryable<ProblemGroup> GetAllByContest(int contestId);

        IQueryable<ProblemGroup> GetAllByContestId(int contestId);

        Task<double> GetLastNonDeletedByContest(int contestId);
    }
}