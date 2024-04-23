namespace OJS.Services.Ui.Data
{
    using OJS.Data.Models.Contests;
    using OJS.Data.Models.Users;
    using OJS.Services.Common.Data;
    using System.Linq;
    using System.Threading.Tasks;

    public interface IExamGroupsDataService : IDataService<ExamGroup>
    {
        Task<ExamGroup?> GetByExternalIdAndAppId(int? externalId, string appId);

        Task<int> GetIdByExternalIdAndAppId(int? externalId, string appId);

        Task<int?> GetContestIdById(int id);

        IQueryable<ExamGroup> GetAllByLecturer(string lecturerId);

        IQueryable<UserProfile> GetUsersByIdQuery(int id);

        Task RemoveUserByIdAndUser(int id, string userId);

        Task RemoveContestByContest(int contestId);
    }
}