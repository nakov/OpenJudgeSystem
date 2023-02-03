namespace OJS.Services.Ui.Models.Search;

using AutoMapper;
using OJS.Data.Models.Problems;
using SoftUni.AutoMapper.Infrastructure.Models;

public class ProblemSearchServiceModel : IMapExplicitly
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public ProblemContestSearchServiceModel? Contest { get; set; } = null!;
    public void RegisterMappings(IProfileExpression configuration) =>
        configuration.CreateMap<Problem, ProblemSearchServiceModel>()
            .ForMember(d => d.Contest, opt => opt.Ignore());
}