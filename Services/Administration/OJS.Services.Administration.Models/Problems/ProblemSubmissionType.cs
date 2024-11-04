namespace OJS.Services.Administration.Models.Problems;

using AutoMapper;
using OJS.Data.Models;
using OJS.Services.Infrastructure.Models.Mapping;
using FluentExtensions.Extensions;

public class ProblemSubmissionType : IMapExplicitly
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public string? SolutionSkeleton { get; set; }

    public int? TimeLimit { get; set; }

    public int? MemoryLimit { get; set; }


    public void RegisterMappings(IProfileExpression configuration) =>
        configuration.CreateMap<SubmissionTypeInProblem, ProblemSubmissionType>()
            .ForMember(d => d.Id, opt
                => opt.MapFrom(d => d.SubmissionTypeId))
            .ForMember(d => d.Name, opt
                => opt.MapFrom(d => d.SubmissionType.Name))
            .ForMember(d => d.SolutionSkeleton, opt
                => opt.MapFrom(d => d.SolutionSkeleton != null ? d.SolutionSkeleton.Decompress().ToString() : null));
}