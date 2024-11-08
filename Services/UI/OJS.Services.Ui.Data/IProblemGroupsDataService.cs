namespace OJS.Services.Ui.Data
{
    using OJS.Data.Models.Problems;
    using OJS.Services.Common.Data;
    using System.Linq;

    public interface IProblemGroupsDataService : IDataService<ProblemGroup>
    {
        IQueryable<ProblemGroup> GetAllByContest(int contestId);
    }
}