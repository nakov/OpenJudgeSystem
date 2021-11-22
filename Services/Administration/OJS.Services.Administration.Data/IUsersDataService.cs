namespace OJS.Services.Administration.Data
{
    using OJS.Data.Models.Users;
    using SoftUni.Services.Infrastructure;
    using System.Linq;
    using System.Threading.Tasks;

    public interface IUsersDataService : IService
    {
        Task<UserProfile> GetByUsername(string username);

        // IQueryable<UserProfile> GetAllByRole(string roleId);
    }
}