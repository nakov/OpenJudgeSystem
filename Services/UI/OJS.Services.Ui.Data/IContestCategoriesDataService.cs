namespace OJS.Services.Ui.Data
{
    using OJS.Data.Models.Contests;
    using OJS.Services.Common.Data;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    public interface IContestCategoriesDataService : IDataService<ContestCategory>
    {
        IQueryable<ContestCategory> GetAllVisible();

        IQueryable<ContestCategory> GetAllVisibleByLecturer(string lecturerId);

        Task<string?> GetNameById(int id);

        Task<bool> HasContestsById(int id);

        IQueryable<ContestCategory> GetAllVisibleOrdered();

        Task<IEnumerable<TServiceModel>> GetAllVisibleMainOrdered<TServiceModel>();

        IEnumerable<TServiceModel> GetAllAllowedStrategyTypes<TServiceModel>(int categoryId);
    }
}