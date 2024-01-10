namespace OJS.Services.Administration.Models.Problems;

using AutoMapper;
using OJS.Data.Models.Problems;
using SoftUni.AutoMapper.Infrastructure.Models;
using System.Linq;
using OJS.Common.Enumerations;

public class ContestViewProblemModel : IMapExplicitly
{
    public int? Id { get; set; }

    public string? Name { get; set; }

    public int Group { get; set; }

    public string? GroupType { get; set; }

    public int PracticeTests { get; set; }

    public int CompeteTests { get; set; }

    public void RegisterMappings(IProfileExpression configuration)
        => configuration.CreateMap<Problem, ContestViewProblemModel>()
            .ForMember(cvp => cvp.Id, opt
                => opt.MapFrom(x => x.Id))
            .ForMember(cvp => cvp.Name, opt
                => opt.MapFrom(x => x.Name))
            .ForMember(cvp => cvp.Group, opt
                => opt.MapFrom(x => x.ProblemGroupId))
            .ForMember(cvp => cvp.GroupType, opt
                => opt.MapFrom(x => x.ProblemGroup.Type.ToString()))
            .ForMember(cvp => cvp.PracticeTests, opt
                => opt.MapFrom(x => x.Tests.Count(t => t.IsTrialTest)))
            .ForMember(cvp => cvp.CompeteTests, opt
                => opt.MapFrom(x => x.Tests.Count(t => t.IsOpenTest)));
}