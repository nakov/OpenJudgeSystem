namespace OJS.Services.Administration.Models.Contests.Submissions;

using AutoMapper;
using OJS.Data.Models.Contests;
using SoftUni.AutoMapper.Infrastructure.Models;

public class BySubmissionSimilarityServiceModel : IMapExplicitly
{
    public string Label { get; set; } = null!;

    public int Value { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
        => configuration.CreateMap<Contest, BySubmissionSimilarityServiceModel>()
            .ForMember(
                d => d.Label,
                opt => opt.MapFrom(s => s.Name))
            .ForMember(
                d => d.Value,
                opt => opt.MapFrom(s => s.Id));
}