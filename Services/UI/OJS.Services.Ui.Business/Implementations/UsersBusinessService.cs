using Microsoft.EntityFrameworkCore;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System.Security.Claims;

namespace OJS.Services.Ui.Business.Implementations
{
    using OJS.Services.Common;
    using OJS.Services.Ui.Data;
    using OJS.Services.Ui.Models.Users;
    using System.Threading.Tasks;

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