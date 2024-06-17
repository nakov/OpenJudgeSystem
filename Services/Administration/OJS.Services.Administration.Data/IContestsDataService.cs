namespace OJS.Services.Administration.Data
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using OJS.Data.Models.Contests;
    using OJS.Services.Common.Data;
    using OJS.Services.Infrastructure.Models.Mapping;

    public interface IContestsDataService : IDataService<Contest>
    {
        Task<IEnumerable<TServiceModel>> GetAllCompetable<TServiceModel>()
            where TServiceModel : IMapFrom<Contest>;

        Task<IEnumerable<TServiceModel>> GetAllPast<TServiceModel>()
            where TServiceModel : IMapFrom<Contest>;

        Task<Contest?> GetByIdWithProblems(int id);

        Task<Contest?> GetByIdWithParticipants(int id);

        IQueryable<Contest> GetAllActive();

        IQueryable<Contest> GetAllInactive();

        IQueryable<Contest> GetAllUpcoming();

        IQueryable<Contest> GetAllVisible();

        IQueryable<Contest> GetContestWithIps(int id);

        IQueryable<Contest> GetAllVisibleByCategory(int categoryId);

        IQueryable<Contest> GetAllVisibleBySubmissionType(int submissionTypeId);

        IQueryable<Contest> GetAllByLecturer(string? lecturerId);

        IQueryable<Contest> GetAllVisibleByCategoryAndLecturer(int categoryId, string? lecturerId);

        IQueryable<Contest> GetAllWithDeleted();

        Task<int> GetMaxPointsById(int id);

        Task<int> GetMaxPointsForExportById(int id);

        Task<string?> GetNameById(int id);

        Task<bool> IsActiveById(int id);

        Task<bool> IsOnlineById(int id);

        Task<bool> IsUserLecturerInContestByContestAndUser(int id, string? userId);

        Task<bool> IsUserParticipantInByContestAndUser(int id, string? userId);

        Task<bool> IsUserInExamGroupByContestAndUser(int id, string? userId);
        Task<IEnumerable<string>> GetProblemNamesById(int id);
    }
}