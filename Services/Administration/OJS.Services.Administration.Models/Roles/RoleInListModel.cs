namespace OJS.Services.Administration.Models.Roles;

using OJS.Data.Models.Users;
using SoftUni.AutoMapper.Infrastructure.Models;

public class RoleInListModel : IMapFrom<Role>
{
    public string? Id { get; set; }

    public string? Name { get; set; }
}