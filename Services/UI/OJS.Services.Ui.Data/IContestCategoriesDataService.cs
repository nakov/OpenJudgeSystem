namespace OJS.Services.Ui.Data
{
    using OJS.Data.Models.Contests;
    using OJS.Services.Common.Data;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    public interface IContestCategoriesDataService : IDataService<ContestCategory>
    {
        Task<IEnumerable<T>> GetAllVisible<T>();

        Task<IEnumerable<TServiceModel>> GetAllVisibleMainOrdered<TServiceModel>();

        Task<IEnumerable<T>> GetAllowedStrategyTypesByIds<T>(IEnumerable<int> ids);
    }
}