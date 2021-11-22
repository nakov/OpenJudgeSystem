namespace OJS.Services.Ui.Data
{
    using System.Threading.Tasks;

    using OJS.Data.Models.Users;
    using OJS.Services.Common.Data.Infrastructure;
    using OJS.Services.Infrastructure;
    using System.Linq;

    public interface IUsersDataService : IService
    {
        Task<UserProfile> GetByUsername(string username);
        IQueryable<UserProfile> GetAllByRole(string roleId);
    }
}