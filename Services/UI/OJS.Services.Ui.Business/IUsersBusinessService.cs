using OJS.Services.Ui.Models.Users;
using System.Security.Claims;
using System.Threading.Tasks;

namespace OJS.Services.Ui.Business
{
    using SoftUni.Services.Infrastructure;

    public interface IUsersBusinessService : IService
    {
        public Task<UserProfileServiceModel?> GetUserProfileByUsername(string? username);

        public Task<UserProfileServiceModel?> GetUserProfileById(string userId);

        Task<bool> IsLoggedInUserAdmin(ClaimsPrincipal userPrincipal);
    }
}