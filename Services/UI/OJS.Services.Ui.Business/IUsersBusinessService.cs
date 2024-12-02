namespace OJS.Services.Ui.Business
{
    using System.Threading.Tasks;
    using OJS.Data.Models.Users;
    using OJS.Services.Ui.Models.Search;
    using OJS.Services.Ui.Models.Users;
    using OJS.Services.Infrastructure;

    public interface IUsersBusinessService : IService
    {
        Task<UserProfileServiceModel?> GetUserShortOrFullProfileByLoggedInUserIsAdminOrProfileOwner(string? username);

        Task<string?> GetUserIdByUsername(string? username);

        Task<UserSearchServiceResultModel> GetSearchUsersByUsername(SearchServiceModel model);

        Task<bool> IsUserInRolesOrProfileOwner(string? profileUsername, string[] roles);

        Task AddOrUpdateUser(UserProfile userEntity);

        Task<UserAuthInfoServiceModel?> GetAuthInfo();
    }
}