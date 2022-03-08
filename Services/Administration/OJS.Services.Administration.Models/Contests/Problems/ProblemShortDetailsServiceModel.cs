namespace OJS.Services.Administration.Models.Contests.Problems;

using AutoMapper;
using OJS.Data.Models.Problems;
using SoftUni.AutoMapper.Infrastructure.Models;

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