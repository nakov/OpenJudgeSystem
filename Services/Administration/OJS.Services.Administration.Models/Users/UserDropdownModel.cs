namespace OJS.Services.Administration.Models.Users;

using OJS.Data.Models.Users;
using OJS.Services.Infrastructure.Models.Mapping;

public class UserDropdownModel : IMapFrom<UserProfile>
{
    public string? Id { get; set; }

    public string? UserName { get; set; }
}