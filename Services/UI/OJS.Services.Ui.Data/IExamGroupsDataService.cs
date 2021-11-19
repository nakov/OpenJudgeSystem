namespace OJS.Services.Ui.Data
{
    using OJS.Data.Models.Contests;
    using OJS.Services.Common.Data;
    using System.Threading.Tasks;

    public interface IExamGroupsDataService : IDataService<ExamGroup>
    {
        Task RemoveContestByContest(int contestId);
    }
}