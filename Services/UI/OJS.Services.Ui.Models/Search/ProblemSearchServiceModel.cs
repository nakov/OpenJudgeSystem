namespace OJS.Services.Ui.Models.Search;

using AutoMapper;
using OJS.Data.Models.Problems;
using SoftUni.AutoMapper.Infrastructure.Models;

public class ProblemSearchServiceModel : IMapExplicitly
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public double OrderBy { get; set; }

    public ProblemContestSearchServiceModel? Contest { get; set; }

    public void RegisterMappings(IProfileExpression configuration) =>
        configuration.CreateMap<Problem, ProblemSearchServiceModel>()
            .ForMember(
                m => m.Contest,
                opt => opt.MapFrom(src => src.ProblemGroup.Contest));
}