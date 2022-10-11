namespace OJS.Services.Ui.Data
{
    using OJS.Data.Models.Contests;
    using OJS.Services.Common.Data;
    using OJS.Services.Ui.Models.Contests;
    using SoftUni.Common.Models;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    public interface IContestsDataService : IDataService<Contest>
    {
        Task<IEnumerable<TServiceModel>> GetAllCompetable<TServiceModel>();

        Task<IEnumerable<TServiceModel>> GetAllPracticable<TServiceModel>();

        Task<PagedResult<TServiceModel>> GetAllAsPageByFiltersAndSorting<TServiceModel>(ContestFiltersAndSortingServiceModel model);

        Task<Contest?> GetByIdWithProblems(int id);

        Task<Contest?> GetByIdWithProblemsAndSubmissionTypes(int id);

        Task<Contest?> GetByIdWithParticipants(int id);

        IQueryable<Contest> GetAllActive();

        IQueryable<Contest> GetAllInactive();

        IQueryable<Contest> GetAllUpcoming();

        IQueryable<Contest> GetAllVisibleBySubmissionType(int submissionTypeId);

        IQueryable<Contest> GetAllByLecturer(string lecturerId);

        IQueryable<Contest> GetAllVisibleByCategoryAndLecturer(int categoryId, string lecturerId);

        IQueryable<Contest> GetAllWithDeleted();

        Task<int> GetMaxPointsById(int id);

        Task<int> GetMaxPointsForExportById(int id);

        Task<string?> GetNameById(int id);

        Task<bool> IsActiveById(int id);

        Task<bool> IsOnlineById(int id);

        Task<bool> IsUserLecturerInByContestAndUser(int id, string userId);

        Task<bool> IsUserParticipantInByContestAndUser(int id, string userId);

        Task<bool> IsUserInExamGroupByContestAndUser(int id, string userId);
    }
}