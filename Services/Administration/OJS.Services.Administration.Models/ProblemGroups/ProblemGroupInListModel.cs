namespace OJS.Services.Administration.Models.ProblemGroups;

using OJS.Data.Models.Problems;
using SoftUni.AutoMapper.Infrastructure.Models;
using AutoMapper;

public class ProblemGroupInListModel : IMapExplicitly
{
    public int Id { get; set; }

    public string? Contest { get; set; }

    public bool IsDeleted { get; set; }

    public double OrderBy { get; set; }

    public string? Type { get; set; }

    public void RegisterMappings(IProfileExpression configuration) =>
        configuration.CreateMap<ProblemGroup, ProblemGroupInListModel>()
            .ForMember(x => x.Contest, opt
                => opt.MapFrom(p => p.Contest.Name));
}