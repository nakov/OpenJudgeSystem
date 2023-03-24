namespace OJS.Services.Ui.Models.Search;

using AutoMapper;
using OJS.Data.Models.Contests;
using SoftUni.AutoMapper.Infrastructure.Models;
public class ProblemContestSearchServiceModel : IMapExplicitly
{
    public int Id { get; set; }

    public string? Name { get; set; } = null!;

    public bool CanBeCompeted { get; set; }

    public bool CanBePracticed { get; set; }
    public string Category { get; set; } = string.Empty;

    public void RegisterMappings(IProfileExpression configuration)
        => configuration.CreateMap<Contest, ProblemContestSearchServiceModel>()
            .ForMember(
                dest => dest.Category,
                opt => opt.MapFrom(src => src.Category!.Name));
}