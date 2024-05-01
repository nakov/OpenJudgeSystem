namespace OJS.Services.Administration.Models.Contests.Problems;

using AutoMapper;
using OJS.Data.Models.Problems;
using OJS.Services.Infrastructure.Models.Mapping;
using System.Linq;

public class ProblemRetestServiceModel : IMapExplicitly
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? ContestName { get; set; }

    public int ContestId { get; set; }

    public int SubmissionsCount { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
        => configuration
            .CreateMap<Problem, ProblemRetestServiceModel>()
            .ForMember(
                m => m.ContestName,
                opt => opt.MapFrom(src => src.ProblemGroup.Contest.Name))
            .ForMember(
                m => m.ContestId,
                opt => opt.MapFrom(src => src.ProblemGroup.ContestId))
            .ForMember(
                m => m.SubmissionsCount,
                opt => opt.MapFrom(src => src.Submissions.Count(s => !s.IsDeleted)));
}