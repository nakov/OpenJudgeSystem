using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

namespace OJS.Services.Ui.Business.Implementations
{
    using OJS.Services.Ui.Data;
    using OJS.Services.Ui.Models.Users;
    using System.Threading.Tasks;

    public class UsersBusinessService : IUsersBusinessService
    {
        private readonly IUsersDataService usersData;

        public UsersBusinessService(
            IUsersDataService usersData) =>
            this.usersData = usersData;

        public Task<UserProfileServiceModel?> GetUserProfileByUsername(string? username)
            => this.usersData
                .GetByUsername<UserProfileServiceModel>(username);
    }
}