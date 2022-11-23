namespace OJS.Services.Ui.Business.Implementations
{
    using System.Security.Claims;
    using System.Threading.Tasks;
    using Microsoft.EntityFrameworkCore;
    using OJS.Services.Common;
    using OJS.Services.Ui.Data;
    using OJS.Services.Ui.Models.Users;
    using SoftUni.AutoMapper.Infrastructure.Extensions;

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

        public async Task<bool> IsLoggedInUserAdmin(ClaimsPrincipal userPrincipal)
            => await Task.FromResult(userPrincipal.IsInRole("Administrator"));
    }
}