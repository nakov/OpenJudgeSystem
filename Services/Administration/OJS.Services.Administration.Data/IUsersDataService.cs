namespace OJS.Services.Administration.Data
{
    using OJS.Data.Models.Users;
    using SoftUni.Services.Infrastructure;
    using System.Threading.Tasks;

    public interface IUsersDataService : IService
    {
        Task<UserProfile?> GetByUsername(string username);

        // IQueryable<UserProfile> GetAllByRole(string roleId);
    }
}