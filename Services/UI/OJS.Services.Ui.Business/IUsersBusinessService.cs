namespace OJS.Services.Ui.Business
{
    using System.Collections.Generic;
    using System.Security.Claims;
    using OJS.Services.Ui.Models.Search;
    using System.Threading.Tasks;
    using OJS.Services.Ui.Models.Users;
    using SoftUni.Services.Infrastructure;

    public interface IUsersBusinessService : IService
    {
        public Task<UserProfileServiceModel?> GetUserProfileByUsername(string? username);

        public Task<UserProfileServiceModel?> GetUserProfileById(string userId);

        Task<IEnumerable<UserSearchServiceModel>> GetSearchUsersByUsername(string username);

        Task<bool> IsLoggedInUserAdmin(ClaimsPrincipal userPrincipal);
    }
}