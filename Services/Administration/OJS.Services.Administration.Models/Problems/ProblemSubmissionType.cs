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
            .ForMember(pam => pam.Id, opt
                => opt.MapFrom(p => p.SubmissionTypeId))
            .ForMember(pam => pam.Name, opt
                => opt.MapFrom(p => p.SubmissionType.Name))
            .ForMember(pam => pam.SolutionSkeleton, opt
                => opt.MapFrom(p => p.SolutionSkeleton.Decompress().ToString()));
}