namespace OJS.Services.Ui.Data
{
    using System.Threading.Tasks;

    using OJS.Data.Models.Users;
    using SoftUni.Services.Infrastructure;

    public interface IUsersDataService : IService
    {
        Task<UserProfile> GetByUsername(string username);
    }
}