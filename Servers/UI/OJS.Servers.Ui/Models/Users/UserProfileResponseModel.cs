namespace OJS.Servers.Ui.Models.Users
{
    using OJS.Services.Ui.Models.Users;
    using OJS.Services.Infrastructure.Models.Mapping;

    public class UserProfileResponseModel : IMapFrom<UserProfileServiceModel>
    {
        public string Id { get; set; } = null!;

        public string UserName { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string FirstName { get; set; } = null!;

        public string LastName { get; set; } = null!;

        public string? City { get; set; }

        public byte? Age { get; set; }
    }
}