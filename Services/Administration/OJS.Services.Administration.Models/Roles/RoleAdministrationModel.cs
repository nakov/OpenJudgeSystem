namespace OJS.Services.Administration.Models.Roles;

using AutoMapper;
using OJS.Data.Models.Users;
using OJS.Services.Common.Models;
using OJS.Services.Infrastructure.Models.Mapping;

public class RoleAdministrationModel : BaseAdministrationModel<string>, IMapExplicitly
{
    public string? Name { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
    {
        configuration.CreateMap<RoleAdministrationModel, Role>()
            .ForMember(r => r.UsersInRoles, opt
                => opt.Ignore())
            .ForMember(r => r.NormalizedName, opt
                => opt.Ignore())
            .ForMember(r => r.ConcurrencyStamp, opt
                => opt.Ignore());

        configuration.CreateMap<Role, RoleAdministrationModel>()
            .ForMember(ram => ram.OperationType, opt
                => opt.Ignore());
    }
}