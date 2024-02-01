namespace OJS.Services.Ui.Business.Implementations
{
    using System.Linq;
    using System.Security.Claims;
    using System.Threading.Tasks;
    using FluentExtensions.Extensions;
    using Microsoft.EntityFrameworkCore;
    using OJS.Data.Models.Users;
    using OJS.Services.Common;
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
        {
            bool isUserAdminOrProfileOwner = this.IsUserAdminOrProfileOwner(username);

            return isUserAdminOrProfileOwner
                ? this.usersProfileData
                    .GetByUsername<UserProfileServiceModel>(username)
                : this.GetByUsernameAsShortProfile(username);
        }

        public async Task<UserProfileServiceModel?> GetUserProfileById(string userId) =>
            await this.usersProfileData
                .GetByIdQuery(userId)
                .AsNoTracking()
                .FirstOrDefaultAsync()
                .Map<UserProfileServiceModel>();

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
            modelResult.TotalUsersCount = allUsersQueryable.Count();

            return modelResult;
        }

        public async Task<bool> IsLoggedInUserAdmin(ClaimsPrincipal userPrincipal)
            => await Task.FromResult(userPrincipal.IsInRole("Administrator"));

        public async Task AddOrUpdateUser(UserProfile user)
            => await this.usersProfileData.AddOrUpdate<UserProfileServiceModel>(user);

        public async Task<UserAuthInfoServiceModel?> GetAuthInfo()
        {
            var currentUser = this.userProvider.GetCurrentUser();

            if (currentUser.IsNull())
            {
                return null;
            }

            var profile = await this.usersProfileData
                .GetByIdQuery(currentUser.Id!)
                .Include(u => u.UsersInRoles)
                .ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync();

            return profile?.Map<UserAuthInfoServiceModel>();
        }

        private bool IsUserAdminOrProfileOwner(string? username)
        {
            var currentUser = this.userProvider.GetCurrentUser();

            if (currentUser.IsNull() || string.IsNullOrEmpty(username))
            {
                return false;
            }

            return currentUser.IsAdmin ||
                   this.usersProfileData.GetByIdQuery(currentUser.Id).Any(u => u.UserName == username);
        }

        //AsNoTracking() Method is added to prevent ''tracking query'' error.
        //Error is thrown when we map from UserSettings (owned entity) without including the
        //UserProfile (owner entity) in the query.
        private async Task<UserProfileServiceModel?> GetByUsernameAsShortProfile(string? username) =>
            await this.usersProfileData.GetByUsername(username)
                .AsNoTracking()
                .Select(user => new UserProfileServiceModel
                {
                    UserName = user.UserName,
                    Id = user.Id,
                })
                .FirstOrDefaultAsync();
    }
}