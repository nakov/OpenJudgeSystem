namespace OJS.Services.Ui.Data.Implementations
{
    using Microsoft.EntityFrameworkCore;
    using OJS.Data;
    using OJS.Data.Models.Contests;
    using OJS.Data.Models.Users;
    using OJS.Services.Common.Data.Implementations;
    using System.Linq;
    using System.Threading.Tasks;

    public class ExamGroupsDataService : DataService<ExamGroup>, IExamGroupsDataService
    {
        public ExamGroupsDataService(OjsDbContext db)
            : base(db)
        {
        }

        public Task<ExamGroup?> GetByExternalIdAndAppId(int? externalId, string appId)
            => this.One(eg =>
                    eg.ExternalExamGroupId == externalId &&
                    eg.ExternalAppId == appId);

        public Task<int> GetIdByExternalIdAndAppId(int? externalId, string appId)
            => this.GetQuery(eg => eg.ExternalExamGroupId == externalId && eg.ExternalAppId == appId)
                .Select(eg => eg.Id)
                .FirstOrDefaultAsync();

        public Task<int?> GetContestIdById(int id)
            => this.GetByIdQuery(id)
                .Select(eg => eg.ContestId)
                .FirstOrDefaultAsync();

        public IQueryable<ExamGroup> GetAllByLecturer(string lecturerId) =>
            this.GetQuery(eg =>
                    eg.Contest == null ||
                    (eg.Contest.LecturersInContests.Any(l => l.LecturerId == lecturerId) ||
                     eg.Contest.Category!.LecturersInContestCategories.Any(l => l.LecturerId == lecturerId)));

        public IQueryable<UserProfile> GetUsersByIdQuery(int id) =>
            this.GetByIdQuery(id)
                .Include(x => x.UsersInExamGroups)
                .SelectMany(eg => eg.UsersInExamGroups)
                .Include(x => x.User)
                .Select(x => x.User);

        public async Task RemoveUserByIdAndUser(int id, string userId)
        {
            var examGroup = await this.OneById(id);
            var user = examGroup?.UsersInExamGroups.FirstOrDefault(u => u.UserId == userId);
            if (user != null)
            {
                examGroup!.UsersInExamGroups.Remove(user);
                await this.SaveChanges();
            }
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