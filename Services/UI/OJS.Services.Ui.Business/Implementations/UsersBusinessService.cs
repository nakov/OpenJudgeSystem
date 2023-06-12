namespace OJS.Services.Ui.Business.Implementations
{
    using System.Linq;
    using System.Security.Claims;
    using System.Threading.Tasks;
    using Microsoft.EntityFrameworkCore;
    using OJS.Data.Models.Users;
    using OJS.Services.Common;
    using OJS.Services.Infrastructure.Exceptions;
    using OJS.Services.Ui.Data;
    using OJS.Services.Ui.Models.Search;
    using OJS.Services.Ui.Models.Users;
    using SoftUni.AutoMapper.Infrastructure.Extensions;
    using X.PagedList;

    public class UsersBusinessService : IUsersBusinessService
    {
        private readonly IUsersProfileDataService usersProfileData;
        private readonly IUserProviderService userProvider;

        public UsersBusinessService(
            IUsersProfileDataService usersProfileData,
            IUserProviderService userProvider)
        {
            this.usersProfileData = usersProfileData;
            this.userProvider = userProvider;
        }

        public Task<UserProfileServiceModel?> GetUserProfileByUsername(string? username)
            => this.usersProfileData
                .GetByUsername<UserProfileServiceModel>(username);

        public async Task<UserProfileServiceModel?> GetUserProfileById(string userId)
            => await this.usersProfileData
                .GetByIdQuery(userId)
                .MapCollection<UserProfileServiceModel>()
                .FirstOrDefaultAsync();

        public async Task<UserSearchServiceResultModel> GetSearchUsersByUsername(SearchServiceModel model)
        {
            var modelResult = new UserSearchServiceResultModel();

            var allUsersQueryable = this.usersProfileData
                .GetAll()
                .Where(u => u.UserName.Contains(model.SearchTerm!));

            var searchUsers = await allUsersQueryable
                .MapCollection<UserSearchServiceModel>()
                .ToPagedListAsync(model.PageNumber, model.ItemsPerPage);

            modelResult.Users = searchUsers;
            modelResult.TotalUsers = allUsersQueryable.Count();

            return modelResult;
        }

        public async Task<bool> IsLoggedInUserAdmin(ClaimsPrincipal userPrincipal)
            => await Task.FromResult(userPrincipal.IsInRole("Administrator"));

        public async Task AddOrUpdateUser(UserProfile user)
            => await this.usersProfileData.AddOrUpdate<UserProfileServiceModel>(user);

        public async Task<UserAuthInfoServiceModel> GetAuthInfo()
        {
            var currentUser = this.userProvider.GetCurrentUser();

            if (currentUser == null)
            {
                throw new BusinessServiceException("No user is currently in logged in session.");
            }

            var profile = await this.usersProfileData
                .GetByIdQuery(currentUser.Id!)
                .FirstOrDefaultAsync();

            if (profile == null)
            {
                throw new BusinessServiceException("No profile found for user");
            }

            return profile.Map<UserAuthInfoServiceModel>();
        }
    }
}