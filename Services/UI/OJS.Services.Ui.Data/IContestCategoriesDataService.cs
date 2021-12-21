namespace OJS.Services.Ui.Data
{
    using OJS.Data.Models.Contests;
    using OJS.Services.Common.Data;
    using System.Linq;
    using System.Threading.Tasks;

    public interface IContestCategoriesDataService : IDataService<ContestCategory>
    {
        IQueryable<ContestCategory> GetAllVisible();

        IQueryable<ContestCategory> GetAllVisibleByLecturer(string lecturerId);

        Task<string?> GetNameById(int id);

        Task<bool> HasContestsById(int id);
    }
}