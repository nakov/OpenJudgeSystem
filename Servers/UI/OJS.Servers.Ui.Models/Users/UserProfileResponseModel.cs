namespace OJS.Servers.Ui.Models.Users
{
    using OJS.Services.Ui.Models.Users;
    using SoftUni.AutoMapper.Infrastructure.Models;

    public class UserProfileResponseModel : IMapFrom<UserProfileServiceModel>
    {
        public string Id { get; set; }

        public string UserName { get; set; }

        public string Email { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }
    }
}