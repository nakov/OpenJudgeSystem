namespace OJS.Services.Ui.Models.Search;

using OJS.Data.Models.Users;
using AutoMapper;
using OJS.Services.Infrastructure.Models.Mapping;

public class UserSearchServiceModel : IMapExplicitly
{
    public string Id { get; set; } = null!;

    public string Name { get; set; } = null!;

    public void RegisterMappings(IProfileExpression configuration)
        => configuration.CreateMap<UserProfile, UserSearchServiceModel>()
            .ForMember(d => d.Name, opt => opt.MapFrom(p => p.UserName));
}