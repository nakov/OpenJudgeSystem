namespace OJS.Services.Administration.Models;

using AutoMapper;
using OJS.Data.Models.Contests;
using SoftUni.AutoMapper.Infrastructure.Models;

public class SelectListItemApiServiceModel : IMapExplicitly
{
    public string? Text { get; set; }

    public string? Value { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
        => configuration
            .CreateMap<Contest, SelectListItemApiServiceModel>()
            .ForMember(m => m.Text, opt => opt.MapFrom(src => src.Name))
            .ForMember(m => m.Value, opt => opt.MapFrom(src => src.Id));
}