namespace OJS.Services.Administration.Data;

using OJS.Services.Common.Data;
using OJS.Data.Models.Users;
using System.Threading.Tasks;

public interface IUsersDataService : IDataService<UserProfile>
{
    Task<UserProfile?> GetByUsername(string username);

    // IQueryable<UserProfile> GetAllByRole(string roleId);
}