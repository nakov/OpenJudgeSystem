namespace OJS.Services.Ui.Models.Users;

using OJS.Data.Models.Users;
using OJS.Services.Infrastructure.Models.Mapping;

public class RoleServiceModel : IMapFrom<Role>
{
    public string Id { get; set; } = default!;

    public string Name { get; set; } = default!;
}