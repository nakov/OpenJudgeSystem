namespace OJS.Services.Administration.Models.Contests.Problems;

using AutoMapper;
using OJS.Data.Models.Problems;
using OJS.Services.Infrastructure.Models.Mapping;

public class ProblemShortDetailsServiceModel : IMapExplicitly
{
    public int ContestId { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
        => configuration
            .CreateMap<Problem, ProblemShortDetailsServiceModel>()
            .ForMember(
                m => m.ContestId,
                opt => opt.MapFrom(src => src.ProblemGroup.ContestId));
}