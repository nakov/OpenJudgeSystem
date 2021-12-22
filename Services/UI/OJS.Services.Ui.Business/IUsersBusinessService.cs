using OJS.Services.Ui.Models.Users;
using System.Threading.Tasks;

namespace OJS.Services.Ui.Business
{
    using SoftUni.Services.Infrastructure;

    public interface IUsersBusinessService : IService
    {
        public Task<UserProfileServiceModel?> GetUserProfileByUsername(string? username);
    }
}