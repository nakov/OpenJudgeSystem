namespace OJS.Services.Ui.Data.Implementations
{
    using OJS.Data;
    using OJS.Data.Models.Contests;
    using OJS.Services.Common.Data.Infrastructure.Implementations;
    using System.Threading.Tasks;

    public class ExamGroupsDataService : DataService<ExamGroup>, IExamGroupsDataService
    {
        public ExamGroupsDataService(OjsDbContext db) : base(db)
        {
        }

        public Task RemoveContestByContest(int contestId)
            =>  this.DbSet.UpdateFromQueryAsync(
                eg => eg.ContestId == contestId,
                examGroup => new ExamGroup
                {
                    ContestId = null
                });
    }
}