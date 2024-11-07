namespace OJS.Services.Ui.Data
{
    using OJS.Data.Models.Contests;
    using OJS.Services.Common.Data;
    using OJS.Services.Ui.Models.Contests;
    using OJS.Services.Infrastructure.Models;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    public interface IContestsDataService : IDataService<Contest>
    {
        public Task<PagedResult<TServiceModel>> ApplyFiltersSortAndPagination<TServiceModel>(
            IQueryable<Contest> contests,
            ContestFiltersServiceModel model);

        Task<IEnumerable<TServiceModel>> GetAllCompetable<TServiceModel>();

        Task<IEnumerable<TServiceModel>> GetAllExpired<TServiceModel>();

        Task<PagedResult<TServiceModel>> GetAllAsPageByFiltersAndSorting<TServiceModel>(ContestFiltersServiceModel model);

        Task<Contest?> GetByIdWithProblems(int id);

        Task<TServiceModel?> GetById<TServiceModel>(int id);

        Task<TServiceModel?> GetByProblemId<TServiceModel>(int id);

        IQueryable<Contest> GetLatestForParticipantByUsername(string username);

        IQueryable<Contest> GetAllVisible();

        Task<int> GetMaxPointsForExportById(int id);

        Task<bool> IsOnlineById(int id);

        Task<bool> IsUserLecturerInByContestAndUser(int id, string userId);

        Task<bool> IsUserInExamGroupByContestAndUser(int id, string userId);
    }
}