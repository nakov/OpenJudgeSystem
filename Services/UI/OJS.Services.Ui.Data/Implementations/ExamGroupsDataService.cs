namespace OJS.Services.Ui.Data.Implementations
{
    using OJS.Data;
    using OJS.Data.Models.Contests;
    using OJS.Services.Common.Data.Implementations;
    using System.Threading.Tasks;

    public class ExamGroupsDataService : DataService<ExamGroup>, IExamGroupsDataService
    {
        public ExamGroupsDataService(OjsDbContext db)
            : base(db)
        {
        }

        public Task RemoveContestByContest(int contestId)
            => this.GetQuery(eg => eg.ContestId == contestId)
                .UpdateFromQueryAsync(
                    examGroup => new ExamGroup
                    {
                        ContestId = null,
                    });
    }
}