namespace OJS.Services.Administration.Models.Users;

using OJS.Data.Models.Users;
using SoftUni.AutoMapper.Infrastructure.Models;

public class UserDropdownModel : IMapFrom<UserProfile>
{
    public string? Id { get; set; }

    public string? UserName { get; set; }
}