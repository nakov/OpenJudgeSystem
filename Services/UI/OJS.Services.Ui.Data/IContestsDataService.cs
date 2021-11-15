namespace OJS.Services.Ui.Data
{
    using OJS.Data.Models.Contests;
    using OJS.Services.Common.Data.Infrastructure;
    using OJS.Services.Infrastructure.Mapping;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    public interface IContestsDataService : IDataService<Contest>
    {
        Task<IEnumerable<TServiceModel>> GetAllCompetable<TServiceModel>()
            where TServiceModel : IMapFrom<Contest>;

        Task<IEnumerable<TServiceModel>> GetAllPast<TServiceModel>()
            where TServiceModel : IMapFrom<Contest>;

        Task<bool> IsUserLecturerInByContestAndUser(int id, string userId);
    }
}