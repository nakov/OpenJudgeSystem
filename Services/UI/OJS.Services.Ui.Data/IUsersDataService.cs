namespace OJS.Services.Ui.Data
{
    using System.Threading.Tasks;

    using OJS.Data.Models.Users;
    using OJS.Services.Common.Data;

    public interface IUsersDataService : IDataService<UserProfile>
    {
        Task<TServiceModel> GetByUsername<TServiceModel>(string username);
    }
}