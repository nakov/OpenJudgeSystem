namespace OJS.Services.Ui.Models.Users;

using OJS.Data.Models.Users;
using OJS.Services.Infrastructure.Models.Mapping;

public class UserServiceModel : IMapFrom<UserProfile>
{
    public string Id { get; set; } = string.Empty;

    public string? UserName { get; set; }
}