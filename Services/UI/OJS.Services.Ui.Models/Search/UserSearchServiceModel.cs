namespace OJS.Services.Ui.Models.Search;

using OJS.Data.Models.Users;
using SoftUni.AutoMapper.Infrastructure.Models;

public class UserSearchServiceModel : IMapFrom<UserProfile>
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;
}