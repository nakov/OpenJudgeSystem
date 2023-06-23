namespace OJS.Services.Ui.Models.Users;

using OJS.Data.Models.Users;
using SoftUni.AutoMapper.Infrastructure.Models;

public class RoleServiceModel : IMapFrom<Role>
{
    public string Id { get; set; } = default!;

    public string Name { get; set; } = default!;
}