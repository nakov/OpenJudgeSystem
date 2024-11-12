namespace OJS.Services.Ui.Data.Implementations
{
    using OJS.Data;
    using OJS.Data.Models.Problems;
    using OJS.Services.Common.Data.Implementations;
    using System.Linq;

    public class ProblemGroupsDataService : DataService<ProblemGroup>, IProblemGroupsDataService
    {
        public ProblemGroupsDataService(OjsDbContext db)
            : base(db)
        {
        }

        public IQueryable<ProblemGroup> GetAll() => this.GetQuery();

        public IQueryable<ProblemGroup> GetAllByContest(int contestId) =>
            this.GetAll()
                .Where(pg => pg.ContestId == contestId);
    }
}